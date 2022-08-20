import { Sequelize, DataTypes } from "sequelize";
const sequelize = new Sequelize("mysql::memory:");

export const Domain = sequelize.define(
    "Domain",
    {
        // Model attributes are defined here
        domainId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        domainName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        // Other model options go here
    }
);

Domain.sync();
