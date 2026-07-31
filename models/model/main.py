from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
#from mlxtend.preprocessing import minmax_scaling
from scipy.interpolate import interp1d
import numpy as np
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sd-010-iitisoc-frontend.vercel.app"],  # your Vite frontend origin, or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = tf.keras.models.load_model("Shapepredict.keras")
class pts(BaseModel):
    x:float
    y:float

class Strokes(BaseModel):
    points:list[pts]

def json_fix (points):
    merged_points = []
    for point in points:
         x=point.x
         y=point.y
         merged_points.append([x,y])
         
    return merged_points
             
            

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
    #scaled_x = minmax_scaling(x, columns=[0])
    #scaled_y = minmax_scaling(y, columns=[0])
    scaled_x = (x-x.min())/(x.max()-x.min())

    scaled_y = (y-y.min())/(y.max()-y.min())

    scaled_points = np.column_stack([scaled_x,scaled_y])
    return scaled_points


classes=["circle","line","square","triangle"]
@app.get("/")
def message():
    return {"message":"Shape convertor"}

@app.post("/predict")
async def predict(stroke:Strokes):
    p_array = stroke.points
    p_array=json_fix(p_array)
    p_array = interpolate(p_array)
    p_array = normalization(p_array)
    p_array=p_array.reshape(1,64,2)
    result = model.predict(p_array)
    index = np.argmax(result)
    shape = classes[index]
    accuracy = result.max()
    return {"shape":shape,"accuracy":float(accuracy)}


if __name__ == "__main__":
    port = int(os.environ.get("PORT",10000))
    uvicorn.run(app,host="0.0.0.0",port=port)
    