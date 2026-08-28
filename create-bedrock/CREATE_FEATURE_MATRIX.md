# Create Mod - Feature Porting Matrix

| Feature | Java Source File | Extracted Behavior | Bedrock Reimplementation | Status | Notes |
|---------|------------------|--------------------|--------------------------|--------|-------|
| Shaft | `ShaftBlock.java` | Yes | JSON generated (`create:shaft`). TS stub added. | In Progress | Scripting needed for network. |
| Powered Shaft | `PoweredShaftBlock.java` | Yes | JSON generated (`create:powered_shaft`). | In Progress | Dependent on Steam Engine. |
| Steam Engine | `SteamEngineBlock.java` | Yes | JSON generated (`create:steam_engine`). TS stub added. | In Progress | Shaft replacement logic needed in TS. |
| Cogwheel (Small/Large) | `CogWheelBlock.java` | Yes | (Pending) | In Progress | Includes diagonal meshing and Large Cog visual offsets |
| Casings | `CasingBlock.java` | Yes | (Pending) | In Progress | Simple decorative blocks |
| Encased Shafts | `EncasedShaftBlock.java` | Yes | (Pending) | In Progress | Sneak-wrench reverts to shaft |
| Encased Cogwheels | `EncasedCogwheelBlock.java` | Yes | (Pending) | In Progress | Sneak-wrench reverts to cogwheel, manages top/bottom shafts |
