from fastapi import FastAPI
import uvicorn
from .ai import generate_blog_post, BlogPostMeta, BlogPost


app = FastAPI()


@app.post("/generate")
async def generate(meta: BlogPostMeta) -> BlogPost:
    return generate_blog_post(meta)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
