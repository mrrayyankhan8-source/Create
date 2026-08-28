# Bedrock Limitations Documented During Porting

## Large Cogwheels
- **Issue:** The Java version's `LARGE_GEAR` shape relies on bounding boxes exceeding the Bedrock 16x16x16 voxel limit for block geometries.
- **Workaround:** Implemented standard representation in JSON `[28, 16, 28]`. This may require a dummy entity or multiple overlapping block hitboxes in Bedrock via scripting to prevent clipping through adjacent blocks if the native client clips the size array.
