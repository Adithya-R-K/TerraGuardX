import urllib.request
import json

def test_live_integration():
    # 1. Health check
    res = urllib.request.urlopen('http://localhost:8000/api/health')
    print('1. Health check:', res.status, res.read().decode())

    # 2. Login with configured password
    req = urllib.request.Request(
        'http://localhost:8000/api/auth/login',
        data=json.dumps({'username': 'admin', 'password': 'Sasikarthi@123'}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req)
    auth = json.loads(res.read().decode())
    token = auth['access_token']
    print('2. Login OK with password from .env! Role:', auth['role'])

    # 3. Realtime sync trigger
    req = urllib.request.Request(
        'http://localhost:8000/api/realtime/sync',
        data=b'{}',
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    sync_res = json.loads(res.read().decode())
    print('3. Live Real-Time Ingestion Sync OK:', sync_res['records'])

    # 4. Run simulation with LIVE data
    req = urllib.request.Request(
        'http://localhost:8000/api/prediction',
        data=b'{}',
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    sim = json.loads(res.read().decode())
    print(f"4. Live Simulation OK. Run ID: {sim['run_id']}, Mode: {sim['data_mode']}, Zones: {len(sim['zones'])}")

    # 5. Check live rainfall for Zone 1
    req = urllib.request.Request(
        'http://localhost:8000/api/rainfall/Z01',
        headers={'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    rain = json.loads(res.read().decode())
    print(f"5. Live Rainfall for Z01: Mode: {rain['data_mode']}, Provider: {rain.get('provider')}, Records: {len(rain['hourly'])}")

    # 6. Check data status
    req = urllib.request.Request(
        'http://localhost:8000/api/data-status',
        headers={'Authorization': f'Bearer {token}'}
    )
    res = urllib.request.urlopen(req)
    status = json.loads(res.read().decode())
    print('6. Data Stream Health Status:')
    print(json.dumps(status, indent=2))

    # 7. Frontend check
    fe_res = urllib.request.urlopen('http://localhost:5173/')
    content = fe_res.read().decode()
    assert 'TerraGuardX' in content
    print(f"7. Frontend server OK. Status: {fe_res.status}")

if __name__ == '__main__':
    test_live_integration()
