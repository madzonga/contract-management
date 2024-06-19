import { Model, Optional } from "sequelize";

declare module "../models/job" {
    import { Contract } from "../models/contract";

    interface Job {
        Contract?: Contract;
    }
}

declare module "./contract" {
    interface Contract {
        Client?: Profile;
        Contractor?: Profile;
    }
}
