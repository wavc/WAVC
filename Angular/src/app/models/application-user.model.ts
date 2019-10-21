export class ApplicationUserModel {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;

    constructor(item: any) {
        this.id = item.id;
        this.firstName = item.firstName;
        this.lastName = item.lastName;
        this.profilePictureUrl = item.profilePictureUrl;
    }
}
