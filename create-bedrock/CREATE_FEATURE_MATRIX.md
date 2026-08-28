# Create Mod - Feature Porting Matrix

| Feature | Java Source File | Extracted Behavior | Bedrock Reimplementation | Status | Notes |
|---------|------------------|--------------------|--------------------------|--------|-------|
| Shaft | `ShaftBlock.java` | Yes | JSON generated (`create:shaft`). TS stub added. | In Progress | Scripting needed for network. |
| Powered Shaft | `PoweredShaftBlock.java` | Yes | JSON generated (`create:powered_shaft`). | In Progress | Dependent on Steam Engine. |
| Steam Engine | `SteamEngineBlock.java` | Yes | JSON generated (`create:steam_engine`). TS stub added. | In Progress | Shaft replacement logic needed in TS. |
