export class Rental {
    public imagePath: string;
    public owner: string;
    public ownerContact: number;
    public city: string;
    public landmark: string;
    public address: string;
    public type: string;
    public bedroomType: string;
    public familyPref: string;
    public foodPref: string;
    public distance: number;
    public rent : number;
    public expectedAvailability : string;
    public refreeName : string;
    public refreeContact : number;
    public comments : string;
    public lastUpdate : string;

    constructor(
        imagePath: string,
        owner: string, 
        ownerContact : number,
        city : string,
        landmark : string,
        address : string,
        type: string, 
        bedroomType: string,
        familyPref : string,
        foodPref : string,
        distance: number,
        rent: number,
        expectedAvailability : string,
        refreeName : string,
        refreeContact : number,
        comments : string,
        lastUpdate : string
        ) 

        {
        this.imagePath = imagePath;
        this.owner = owner;
        this.ownerContact = ownerContact;
        this.city = city;
        this.landmark = landmark;
        this.address = address;
        this.type = type;
        this.bedroomType = bedroomType;
        this.familyPref = familyPref;
        this.foodPref = foodPref;
        this.distance = distance;
        this.rent = rent;
        this.expectedAvailability = expectedAvailability;
        this.refreeName = refreeName;
        this.refreeContact = refreeContact;
        this.comments = comments;
        this.lastUpdate = lastUpdate;
        }
}
