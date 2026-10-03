import urllib.request
import json

def test_integration():
    # 1. Health check
    res = urllib.request.urlopen('http://localhost:8000/api/health')
    print('1. Health check:', res.status, res.read().decode())

    # 2. Login
    req = urllib.request.Request(
        'http://localhost:8000/api/auth/login',
        data=json.dumps({'username': 'admin', 'password': 'admin123'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    auth = json.loads(res.read().decode())
    token = auth['access_token']
    print('2. Login OK. Role:', auth['role'])

    # 3. Simulation run
    req = urllib.request.Request(
        'http://localhost:8000/api/prediction',
        data=b'{}',
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    sim = json.loads(res.read().decode())
    print(f"3. Simulation OK. Run ID: {sim['run_id']}, Zones: {len(sim['zones'])}")

    # 4. Risk zones
    req = urllib.request.Request(
        'http://localhost:8000/api/risk',
        headers={'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    risk = json.loads(res.read().decode())
    print(f"4. Risk API OK. Zones returned: {len(risk['zones'])}")

    # 5. Alerts
    req = urllib.request.Request(
        'http://localhost:8000/api/alerts',
        headers={'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    alerts = json.loads(res.read().decode())
    print(f"5. Alerts OK. Active alerts count: {len(alerts)}")

    # 6. Model performance
    req = urllib.request.Request(
        'http://localhost:8000/api/model/performance',
        headers={'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    perf = json.loads(res.read().decode())
    print(f"6. Model Performance OK. Static version: v{perf['static']['version']}, Dynamic version: v{perf['dynamic']['version']}")

    # 7. Frontend check
    fe_res = urllib.request.urlopen('http://localhost:5173/')
    content = fe_res.read().decode()
    assert 'TerraGuardX' in content
    print(f"7. Frontend server OK. Returned status {fe_res.status}, verified HTML markup.")

if __name__ == '__main__':
    test_integration()
