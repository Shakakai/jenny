import pytest
from fastapi.testclient import TestClient
from jenny_ai.server import app
from jenny_ai.ai import BlogPost

client = TestClient(app)

@pytest.mark.asyncio
async def test_generate_blog_post_endpoint():
    # Arrange
    request_body = {
        "background": "I am a software engineer with 10 years of experience",
        "style": "Professional and technical", 
        "key_points": "Python, TypeScript, Cloud Architecture",
        "instructions": "Write about modern software development practices"
    }

    # Act
    response = client.post("/generate", json=request_body)

    # Assert
    assert response.status_code == 200
    result = response.json()
    assert isinstance(result["title"], str)
    assert len(result["title"]) > 0
    assert isinstance(result["content"], str) 
    assert len(result["content"]) > 0
    assert "Python" in result["content"]
    assert "TypeScript" in result["content"]
    assert "Cloud" in result["content"]
