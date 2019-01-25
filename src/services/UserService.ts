export class UserService {
    constructor(private auth: firebase.auth.Auth) {}

    public getCurrentUserToken(): Promise<string> {
        return this.auth.currentUser!.getIdToken(true)
    }
}