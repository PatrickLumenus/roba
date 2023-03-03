

export class Scope {

    private constructor() {}

    static Global = "*";
    static None = "";
    static Named(name: string): string {
        return name.trim();
    }
}