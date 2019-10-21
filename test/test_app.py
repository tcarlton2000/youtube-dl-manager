from test.utils import client


def test_index():
    # WHEN
    resp = client.get("/")

    # THEN
    assert resp.status == "200 OK", resp.get_json()
    assert resp.mimetype == "text/html"
    assert "<html>" in str(resp.get_data())
