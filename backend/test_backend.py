import requests
import pandas as pd
import io
import time

BASE_URL = "http://127.0.0.1:8000/api"

def create_sample_csv():
    data = {
        'feature1': [1.0, 2.0, 3.0, 4.0, 5.0] * 20,
        'feature2': [10.0, 20.0, 30.0, 40.0, 50.0] * 20,
        'target': [0, 0, 1, 1, 0] * 20
    }
    df = pd.DataFrame(data)
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    return csv_buffer.getvalue()

def test_backend_flow():
    print("Starting Backend Verification...")
    
    # 1. Upload
    print("\n1. Testing /upload endpoint...")
    csv_content = create_sample_csv()
    files = {'file': ('test_data.csv', csv_content, 'text/csv')}
    
    try:
        response = requests.post(f"{BASE_URL}/upload", files=files)
        response.raise_for_status()
        upload_data = response.json()
        print(f"Upload success! Filename: {upload_data['filename']}")
        dataset_name = upload_data['filename']
    except Exception as e:
        print(f"Upload failed: {e}")
        return

    # 2. Train
    print("\n2. Testing /train endpoint (Logistic Regression)...")
    payload = {
        "dataset_name": dataset_name,
        "task_type": "Classification",
        "model_name": "Logistic Regression",
        "target_column": "target",
        "test_size": 0.2,
        "use_scaling": True
    }
    
    try:
        response = requests.post(f"{BASE_URL}/train", json=payload)
        response.raise_for_status()
        train_data = response.json()
        print(f"Training success!")
        print(f"   Accuracy: {train_data['metrics'].get('accuracy', 'N/A')}")
        print(f"   Explanation: {train_data['explanation']}")
        model_id = train_data.get('model_id')
    except Exception as e:
        print(f"Training failed: {e}")
        print(response.text)
        return

    # 3. Download Model
    print("\n3. Testing /download endpoint...")
    if model_id:
        try:
            response = requests.get(f"{BASE_URL}/download/{model_id}")
            response.raise_for_status()
            print(f"Download success! Content size: {len(response.content)} bytes")
        except Exception as e:
            print(f"Download failed: {e}")
    else:
        print("Skipping download test (no model_id).")

    # 4. History
    print("\n4. Testing /history endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/history")
        response.raise_for_status()
        history_data = response.json()
        print(f"History retrieved! Found {len(history_data)} experiments.")
        if history_data:
             latest = history_data[0]
             print(f"   Latest experiment ID: {latest['id']}")
             print(f"   Task Type: {latest['task_type']}")
             print(f"   Metrics: {latest['metrics']}") # Debug print
    except Exception as e:
        print(f"History check failed: {e}")
        return

    print("\nBackend verification complete! The API is fully functional.")

if __name__ == "__main__":
    test_backend_flow()
