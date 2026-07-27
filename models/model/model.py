import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras import callbacks

from tensorflow.keras.layers import LSTM,Dense
from sklearn.model_selection import train_test_split
from scipy.interpolate import interp1d
import numpy as np
from tensorflow.keras.callbacks import EarlyStopping
from mlxtend.preprocessing import minmax_scaling
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.utils import to_categorical

circle_path = '../datasets/circle.ndjson'
line_path = '../datasets/line.ndjson'
square_path = '../datasets/square.ndjson'
triangle_path = '../datasets/triangle.ndjson'
print("reading circle")
circle = pd.read_json(circle_path,lines=True,nrows=5000) 
print("reading circle done")
print("reading line")
line = pd.read_json(line_path,lines=True,nrows=5000) 
print("reading line done")
square = pd.read_json(square_path,lines=True,nrows=5000) 
triangle = pd.read_json(triangle_path,lines=True,nrows=5000) 


shape_dataset=pd.concat([circle,line,square,triangle],ignore_index=True)
Drawing_column = shape_dataset["drawing"]
classes=["circle","line","square","triangle"]
def merged (Drawing_column):
    points=[]
    for Drawing in Drawing_column:
         merged_points = []
         for stroke in Drawing:
             x=stroke[0]
             y=stroke[1]
             merged_points.extend(zip(x,y))
         points.append(merged_points)
    return points
                         
            



def interpolate(points) :
    array_points = np.array(points)
    x = array_points[:,0]
    y = array_points[:,1]
    old_indicies = np.arange(len(points))
    fx = interp1d(old_indicies,x)
    fy = interp1d(old_indicies,y)
    new_indices = np.linspace(0,len(points)-1,64)
    x_new = fx(new_indices)
    y_new = fy(new_indices)
    new_points = np.column_stack([x_new,y_new])
    return new_points


def normalization(points):
    x = points[:,0]
    y = points[:,1]
    scaled_x = minmax_scaling(x, columns=[0])
    scaled_y = minmax_scaling(y, columns=[0])

    scaled_points = np.column_stack([scaled_x,scaled_y])
    return scaled_points


Drawing = merged (Drawing_column)
X =[]
for points in Drawing :
    points = interpolate(points)
    points = normalization(points)
    X.append(points)

X = np.array(X,dtype=np.float32)

y = shape_dataset["word"]
encoder = LabelEncoder()
labels = encoder.fit_transform(y)

print("xshape",X.shape)
print("yshape",y.shape)

train_X, val_X, train_y, val_y = train_test_split(X,labels,test_size=0.2,stratify=labels,random_state=1)
train_y = to_categorical(train_y)
val_y = to_categorical(val_y)

early_stopping = EarlyStopping(
    min_delta=0.001,
    patience=10, 
    restore_best_weights=True,
)

model= Sequential()
model.add(LSTM(64,input_shape=(64,2),return_sequences=True))
model.add(LSTM(64,return_sequences=False))
model.add(Dense(units=4, activation='softmax'))
model.summary()
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)
history = model.fit(
    train_X,train_y,
    validation_data=(val_X, val_y),
    batch_size=128,
    epochs=50,
    callbacks=[early_stopping]
    
)
history_df = pd.DataFrame(history.history)
print("train_x",train_X,"trainy",train_y,"valx",val_X,"valy",val_y)
print("Minimum Validation Loss: {:0.4f}".format(history_df['val_loss'].min()))
print("Minimum training Loss: {:0.4f}".format(history_df['loss'].min()))
print("Minimum training accuracy: {:0.4f}".format(history_df['accuracy'].max()))
print("Minimum val accuracy: {:0.4f}".format(history_df['val_accuracy'].max()))
model.evaluate(val_X,val_y)
model.save("Shapepredict.keras")




