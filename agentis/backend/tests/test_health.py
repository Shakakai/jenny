from fastapi.testclient import TestClient
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))
from main import app

client = TestClient(app)


def test_health_returns_200() -> None:
    response = client.get("/health")
    assert response.status_code == 200


def test_health_schema() -> None:
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"
    assert data["version"] == "0.1.0"


def test_create_project_returns_201() -> None:
    response = client.post("/api/projects/", json={
        "name": "Test Project",
        "customer_context": "A test customer",
        "objectives": "Test objectives",
        "viz_thoughts": ""
    })
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "draft"
    assert "id" in data
    # Cleanup
    client.delete(f"/api/projects/{data['id']}")


def test_get_nonexistent_project_returns_404() -> None:
    response = client.get("/api/projects/nonexistent-id")
    assert response.status_code == 404


def test_api_key_status_unconfigured() -> None:
    # Reset the store to ensure a clean state
    from main import api_key_store
    api_key_store.clear()
    response = client.get("/api/settings/api-key/status")
    assert response.status_code == 200
    assert response.json()["configured"] is False


def test_api_key_configure_and_status() -> None:
    client.post("/api/settings/api-key",
                json={"api_key": "sk-test-key"})
    response = client.get("/api/settings/api-key/status")
    assert response.json()["configured"] is True


def test_disallowed_file_returns_403() -> None:
    # Create a project first
    r = client.post("/api/projects/", json={
        "name": "File Test",
        "customer_context": "test",
        "objectives": "test",
        "viz_thoughts": ""
    })
    pid = r.json()["id"]
    # Try to access disallowed file
    response = client.get(f"/api/projects/{pid}/files/secrets.txt")
    assert response.status_code == 403
    # Cleanup
    client.delete(f"/api/projects/{pid}")
