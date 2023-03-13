function Sum(a: number, b: number) {
    return a + b
}

function Devide(a: number, b: number) {
    if (b === 0) {
        throw new Error("Devide by 0 error")
    }

    return a / b
}


test('Example of different tests', () => {
    function DevideByZero(){
        Devide(1,0)
    }
    
    expect(Sum(1, 2)).toBe(3);
    expect(0).not.toBeTruthy()
    expect(0).toBeFalsy()

    expect(Devide(4,2)).toBe(2)

    // Test that the error message says "Devide" somewhere: these are equivalent
    expect(DevideByZero).toThrow(/error/);
    expect(DevideByZero).toThrow('error');

    // Test the exact error message
    expect(DevideByZero).toThrow(/^Devide by 0 error$/);
    expect(DevideByZero).toThrow(new Error('Devide by 0 error'));

    // Test what error type we get, can be used if costume error types are made
    expect(DevideByZero).toThrow(Error);
});


