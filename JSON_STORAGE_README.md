# JSON Storage Fallback System

This project now includes a robust JSON-based data storage system that automatically activates when the PostgreSQL database is not available. This ensures your application continues to function even when the database is offline.

## Features

- **Automatic Fallback**: Seamlessly switches between database and JSON storage
- **Data Persistence**: All data is stored in JSON files in the `backend/data/` directory
- **Real-time Status**: Monitor storage status through the dashboard
- **Data Synchronization**: Automatic sync when database comes back online
- **Offline Mode**: Full functionality even without database connection

## How It Works

### 1. Database Connection Detection
The system continuously monitors the database connection. When a connection fails:
- All database queries automatically fall back to JSON storage
- Users see a clear indication that the system is in offline mode
- Data continues to be stored and retrieved normally

### 2. JSON Storage Structure
Data is stored in the following JSON files:
```
backend/data/
├── users.json           # User accounts and profiles
├── clubs.json           # Club information
├── events.json          # Event details
├── club_memberships.json # Club membership records
├── announcements.json   # System announcements
└── feedback.json        # User feedback
```

### 3. Automatic Synchronization
When the database reconnects:
- The system automatically syncs data from the database to JSON files
- Ensures data consistency between storage methods
- No manual intervention required

## API Endpoints

### Storage Status
- `GET /api/storage/status` - Get current storage status and data counts
- `POST /api/storage/reconnect` - Force reconnection to database
- `POST /api/storage/sync-from-db` - Sync data from database to JSON
- `GET /api/storage/json-data/:type` - View JSON data (for debugging)

### Example Response
```json
{
  "success": true,
  "storage": {
    "isConnected": false,
    "storageType": "json",
    "dataCounts": {
      "users": 4,
      "clubs": 3,
      "events": 2,
      "clubMemberships": 2,
      "announcements": 1,
      "feedback": 0
    },
    "lastChecked": "2024-01-15T10:30:00.000Z"
  }
}
```

## Frontend Integration

The `StorageStatus` component is automatically included in the dashboard and shows:
- Current connection status (Online/Offline)
- Storage type being used (Database/JSON)
- Data record counts
- Last status check time
- Reconnection button

## Configuration

### Environment Variables
The system uses the same database configuration as before:
```env
DB_HOST=10.11.148.104
DB_PORT=5432
DB_NAME=event_management
DB_USER=btechb22567
DB_PASSWORD=loujopro
```

### Default Data
When JSON files don't exist, the system creates them with sample data:
- 4 users (students, club heads, admin)
- 3 clubs with basic information
- 2 sample events
- Sample club memberships

## Usage Examples

### Starting the Server
```bash
cd backend
npm start
```

The server will start regardless of database connectivity:
- If database is available: Uses PostgreSQL with JSON fallback
- If database is unavailable: Uses JSON storage only

### Checking Status
```bash
curl http://localhost:5001/api/storage/status
```

### Forcing Reconnection
```bash
curl -X POST http://localhost:5001/api/storage/reconnect
```

## Benefits

1. **Reliability**: Application never fails due to database issues
2. **Transparency**: Users are informed about storage status
3. **Seamless**: No code changes needed in existing routes
4. **Data Safety**: All data is preserved in JSON files
5. **Automatic Recovery**: System automatically switches back to database when available

## Troubleshooting

### Database Connection Issues
- Check network connectivity to database server
- Verify database credentials in environment variables
- Ensure PostgreSQL service is running

### JSON Storage Issues
- Check file permissions in `backend/data/` directory
- Verify disk space availability
- Review server logs for specific error messages

### Data Synchronization
- Use the `/api/storage/sync-from-db` endpoint to manually sync
- Check the storage status endpoint for current data counts
- Review JSON files directly if needed for debugging

## Development Notes

- The system maintains full API compatibility
- All existing routes work unchanged
- Database queries are automatically translated to JSON operations
- Error handling is consistent across both storage methods
- Performance is optimized for both online and offline scenarios
