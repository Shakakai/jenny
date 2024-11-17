from mindmeld.inference import Inference, run_inference, RuntimeConfig, AIModel, AIProvider
from pydantic import BaseModel, Field
import os

runtime_config = RuntimeConfig(
    models=[
        AIModel(
            name="gpt-4o",
            provider=AIProvider(
                name="openai",
                api_key=os.getenv("OPENAI_API_KEY"),
            ),
        )
    ],
    default_model="gpt-4o",
    eval_model="gpt-4o",
)

class BlogPostMeta(BaseModel):
    background: str = Field(description="Background material on the topic of the blog post")
    style: str = Field(description="The style of the blog post")
    key_points: str = Field(description="Key points to include in the blog post")
    instructions: str = Field(description="Instructions for the blog post")


class BlogPost(BaseModel):
    title: str = Field(description="The title of the blog post")
    content: str = Field(description="The content of the blog post")


blog_post_inference = Inference(
    id="blog_post",
    instructions="Generate a blog post based on the following metadata",
    input_type=BlogPostMeta,
    output_type=BlogPost,
)

def generate_blog_post(meta: BlogPostMeta) -> BlogPost:
    inference_result = run_inference(blog_post_inference, meta, runtime_config)
    if not inference_result.success:
        raise Exception("Failed to generate blog post")
    return inference_result.result
