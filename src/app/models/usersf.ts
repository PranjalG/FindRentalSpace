// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class UsersF {
    public user_email: string;
    public favourite_rentals: string[];
    public parameters: JSON;
    public _id?: ObjectId;
}