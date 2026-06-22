import urllib.request
import urllib.error
import json
import sys

BACKEND_URL = "http://127.0.0.1:5000"

DEMO_ACCOUNTS = [
    {"role": "Super Admin", "email": "superadmin@example.com", "password": "admin123", "expected_role": "admin"},
    {"role": "Admin User", "email": "admin@example.com", "password": "admin123", "expected_role": "admin"},
    {"role": "Manager", "email": "manager@example.com", "password": "manager123", "expected_role": "manager"},
    {"role": "Manager (Geetansh)", "email": "geetanshmalik337@gmail.com", "password": "manager123", "expected_role": "manager"},
    {"role": "User 1", "email": "user1@example.com", "password": "user123", "expected_role": "user"},
    {"role": "User (Kartik)", "email": "kartikz@example.com", "password": "user123", "expected_role": "user"},
    {"role": "User (Alice)", "email": "alice@example.com", "password": "user123", "expected_role": "user"},
    {"role": "User (Bob)", "email": "bob@example.com", "password": "user123", "expected_role": "user"},
]

def make_request(path, method="GET", data=None, token=None):
    url = f"{BACKEND_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = response.read().decode("utf-8")
            return response.status, json.loads(res_data)
    except urllib.error.HTTPError as e:
        try:
            err_data = e.read().decode("utf-8")
            return e.code, json.loads(err_data)
        except Exception:
            return e.code, {"success": False, "message": str(e)}
    except Exception as e:
        return 500, {"success": False, "message": str(e)}

def run_tests():
    print("=" * 70)
    print("STARTING MERN USER MANAGEMENT SYSTEM API TESTS")
    print("=" * 70)
    
    # 1. Health Check
    print("\n[INFO] Checking API Health...")
    status, res = make_request("/api/health")
    if status == 200 and res.get("success"):
        print(f"[OK] Backend is online: {res.get('message')} ({res.get('timestamp')})")
    else:
        print(f"[FAIL] Backend health check failed! Code: {status}, Response: {res}")
        sys.exit(1)
        
    # 2. Test Demo Account Credentials
    print("\n[INFO] Testing Demo Accounts Login & Token Verification:")
    print("-" * 70)
    print(f"{'Role / Account':<25} | {'Email':<30} | {'Status':<10}")
    print("-" * 70)
    
    all_passed = True
    for account in DEMO_ACCOUNTS:
        email = account["email"]
        password = account["password"]
        role_label = account["role"]
        expected_role = account["expected_role"]
        
        # Test Login
        login_status, login_res = make_request(
            "/api/auth/login", 
            method="POST", 
            data={"email": email, "password": password}
        )
        
        if login_status != 200:
            print(f"{role_label:<25} | {email:<30} | [FAIL] (Login Code: {login_status})")
            print(f"   Reason: {login_res.get('message', 'Unknown error')}")
            all_passed = False
            continue
            
        token = login_res.get("data", {}).get("token")
        if not token:
            print(f"{role_label:<25} | {email:<30} | [FAIL] (No Token)")
            all_passed = False
            continue
            
        # Test Token verification via /api/auth/me
        me_status, me_res = make_request("/api/auth/me", token=token)
        if me_status != 200:
            print(f"{role_label:<25} | {email:<30} | [FAIL] (/me Code: {me_status})")
            all_passed = False
            continue
            
        me_user = me_res.get("data", {}).get("user", {})
        returned_email = me_user.get("email")
        returned_role = me_user.get("role")
        
        if returned_email.lower() != email.lower() or returned_role != expected_role:
            print(f"{role_label:<25} | {email:<30} | [FAIL] (Data Mismatch)")
            print(f"   Expected: {email}/{expected_role}, Got: {returned_email}/{returned_role}")
            all_passed = False
        else:
            print(f"{role_label:<25} | {email:<30} | [OK]")
            
    # 3. Test Negative / Invalid Credentials Cases
    print("\n[INFO] Testing Authentication Guards & Security:")
    print("-" * 70)
    
    # Wrong password
    status, res = make_request(
        "/api/auth/login", 
        method="POST", 
        data={"email": "superadmin@example.com", "password": "wrong_password"}
    )
    if status == 401:
        print("[OK] Correctly rejected invalid password (401 Unauthorized)")
    else:
        print(f"[FAIL] Failed security test: accepted invalid password or returned code: {status}")
        all_passed = False
        
    # Non-existent user
    status, res = make_request(
        "/api/auth/login", 
        method="POST", 
        data={"email": "nonexistent@example.com", "password": "password"}
    )
    if status == 401:
        print("[OK] Correctly rejected non-existent user email (401 Unauthorized)")
    else:
        print(f"[FAIL] Failed security test: accepted non-existent user or returned code: {status}")
        all_passed = False
        
    # Access to user profiles without token
    status, res = make_request("/api/users")
    if status == 401 or status == 403:
        print("[OK] Correctly blocked access to /api/users without token")
    else:
        print(f"[FAIL] Failed authorization test: allowed access to /api/users without token ({status})")
        all_passed = False
        
    print("\n" + "=" * 70)
    if all_passed:
        print("ALL TESTS PASSED SUCCESSFULLY! The backend is working perfectly.")
    else:
        print("SOME TESTS FAILED. Please review the details above.")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
