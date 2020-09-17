
export function arrayEqual(a1: Array<string>, a2: Array<string>): boolean {
    for (let i = 0; i < a2.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}
