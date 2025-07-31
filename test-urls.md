# Test URLs for OAuth Flow

## Backend Status
✅ Backend is running on http://localhost:8000
✅ Health check: `{"message":"VibeSec Backend API is running","status":"ok","timestamp":1753934306,"version":"v2.0.0"}`

## Test URLs

### 1. Test Page (Debug Tools)
```
http://localhost:3000/test
```

### 2. Test with Valid Code Format
```
http://localhost:3000/?code=%7B%22data%22%3A%22test-data-123%22%2C%22signature%22%3A%22test-signature-456%22%7D
```

### 3. Test with Invalid JSON
```
http://localhost:3000/?code=invalid-json-code
```

### 4. Test with Missing Fields
```
http://localhost:3000/?code=%7B%22data%22%3A%22test-data-123%22%7D
```

## What Each Test Does

1. **Test Page**: Interactive buttons to test different scenarios
2. **Valid Code**: Tests the full OAuth flow with properly formatted code
3. **Invalid JSON**: Tests JSON parsing error handling
4. **Missing Fields**: Tests validation of required fields

## Expected Results

- **No Code Parameter**: Shows "Authentication Failed" (this is correct!)
- **Valid Code**: Should attempt to call backend API
- **Invalid JSON**: Should show JSON parsing error
- **Missing Fields**: Should show validation error

## Instructions

1. Open browser dev tools (F12) → Console tab
2. Visit any of the test URLs above
3. Watch the console for detailed debug logs
4. The logs will show exactly what's happening at each step
