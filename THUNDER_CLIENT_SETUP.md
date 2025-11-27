# Thunder Client Setup Guide for Add Doctor API

## Endpoint
**POST** `http://localhost:5000/api/admin/add-doctor`

## Request Type
**Form Data** (multipart/form-data)

## Required Fields

### 1. Text Fields (Form)
Add these fields in the **Body > Form** tab:

| Field Name      | Type | Example Value                           | Required |
|----------------|------|----------------------------------------|----------|
| name           | text | Dr. John Smith                         | ✅       |
| email          | text | john.smith@example.com                 | ✅       |
| password       | text | 123456                                 | ✅       |
| specialization | text | Cardiologist                           | ✅       |
| degree         | text | MBBS, MD                               | ✅       |
| experience     | text | 5 years                                | ✅       |
| about          | text | Experienced cardiologist               | ✅       |
| availability   | text | true                                   | ✅       |
| fee            | text | 500                                    | ✅       |
| address        | text | {"line1":"123 Main St","line2":"NYC"} | ✅       |
| slots_booked   | text | {}                                     | Optional |

### 2. File Field
| Field Name | Type | Value                    | Required |
|-----------|------|--------------------------|----------|
| image     | file | Select an image file     | ✅       |

## Step-by-Step Instructions

### Step 1: Create New Request
1. Open Thunder Client in VS Code
2. Click "New Request"
3. Set method to **POST**
4. Enter URL: `http://localhost:5000/api/admin/add-doctor`

### Step 2: Setup Body
1. Click on the **Body** tab
2. Select **Form** (NOT Form-encode or JSON)
3. Add all the fields listed above

### Step 3: Add Text Fields
Click "Add Field" for each text field and enter:
- **name**: `Dr. John Smith`
- **email**: `john.smith@example.com`
- **password**: `123456`
- **specialization**: `Cardiologist`
- **degree**: `MBBS, MD`
- **experience**: `5 years`
- **about**: `Experienced cardiologist specializing in heart diseases`
- **availability**: `true`
- **fee**: `500`
- **address**: `{"line1":"123 Main St","line2":"New York"}`
- **slots_booked**: `{}` (optional)

### Step 4: Add Image File
1. Under **Files** section in the Form
2. Click "Choose File"
3. Field name: `image`
4. Click "Choose File" button and select an image (jpg, png, etc.)

### Step 5: Send Request
Click the **Send** button

## Expected Response

### Success (201 Created)
```json
{
  "success": true,
  "message": "Doctor added successfully",
  "doctor": {
    "_id": "...",
    "name": "Dr. John Smith",
    "email": "john.smith@example.com",
    "image": "https://res.cloudinary.com/...",
    "specialization": "Cardiologist",
    "degree": "MBBS, MD",
    "experience": "5 years",
    "about": "Experienced cardiologist",
    "availability": "true",
    "fee": 500,
    "address": {
      "line1": "123 Main St",
      "line2": "New York"
    },
    "slots_booked": {},
    "date": 1701091200000
  }
}
```

### Error (400 Bad Request) - Missing Fields
```json
{
  "success": false,
  "message": "All fields are required",
  "missing": {
    "name": false,
    "email": false,
    "specialization": true,
    "image": false,
    ...
  }
}
```

## Common Errors & Solutions

### Error 1: "All fields are required"
**Solution**: Check the response to see which fields are missing (look at the `missing` object)

### Error 2: "Invalid email format"
**Solution**: Make sure email is in valid format (e.g., `user@example.com`)

### Error 3: "Password must be at least 6 characters long"
**Solution**: Use a password with 6+ characters

### Error 4: Cannot read property 'path' of undefined
**Solution**: 
- Make sure you selected **Form** (not Form-encode)
- Ensure the file field name is exactly `image`
- Check that a file is actually selected

### Error 5: JSON parse error for address or slots_booked
**Solution**: Ensure these are valid JSON strings:
- ✅ Correct: `{"line1":"123 Main St","line2":"NYC"}`
- ❌ Wrong: `{line1:123 Main St}` or `line1:123`

## Tips
1. **Always use Form (multipart/form-data)** when uploading files
2. **Address must be valid JSON** - Use double quotes for keys and values
3. **slots_booked is optional** - Can be empty `{}`
4. **Image is required** - Must upload an actual image file
5. **All text fields are required** - Don't leave any blank

## Testing with Sample Data
```
name: Dr. Sarah Johnson
email: sarah.johnson@hospital.com
password: password123
specialization: Dermatologist
degree: MBBS, MD Dermatology
experience: 8 years
about: Board certified dermatologist with expertise in cosmetic procedures
availability: true
fee: 350
address: {"line1":"456 Park Avenue","line2":"Suite 200","city":"Boston"}
slots_booked: {}
image: [Select any .jpg or .png file]
```
