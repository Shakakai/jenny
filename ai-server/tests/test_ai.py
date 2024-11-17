from jenny_ai.ai import BlogPostMeta, BlogPost, generate_blog_post


def test_generate_blog_post():
    # Arrange
    meta = BlogPostMeta(
        background="I am a software engineer with 10 years of experience",
        style="Professional and technical",
        key_points="Python, TypeScript, Cloud Architecture",
        instructions="Write about modern software development practices"
    )

    # Act 
    result = generate_blog_post(meta)

    # Assert
    assert isinstance(result, BlogPost)
    assert isinstance(result.title, str) 
    assert len(result.title) > 0
    assert isinstance(result.content, str)
    assert len(result.content) > 0
    assert "Python" in result.content
    assert "TypeScript" in result.content
    assert "Cloud" in result.content
