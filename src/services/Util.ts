export class Util {
    static formatDate(date: Date): string {
        return new Intl.DateTimeFormat('cs-CZ').format(new Date(date))
    }
}