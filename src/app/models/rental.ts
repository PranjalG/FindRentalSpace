// External dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Rental {
    public owner: string;
    public owner_contact: number;
    public city: string;
    public landmark: string;
    public address: string;
    public type: string;
    public bedroom_type: string;
    public family_preference: string;
    public food_preference: string;
    public distance : number;
    public rent: number;
    public expected_availability: string;
    public refree: string;
    public refree_contact: number;
    public comments: string;
    public last_update: string;
    public image_path: string;
    public created_by: string;
    public _id?: ObjectId;
}