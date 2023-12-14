export function calculateMean(nums) {
    // Validate that 'nums' is an array and all elements are numeric
    if (!Array.isArray(nums) || nums.some(isNaN)) {
        throw new Error('Invalid numeric values in the input array');
    }
    // Iterates through each number in the 'nums' array and accumulates the values into the 'accumulator' variable.
    const sum = nums.reduce((accumulator, nextValue) => accumulator + nextValue, 0);
    return Number((sum / nums.length).toFixed(2));
}

export function calculateMedian(nums) {
    // Validate that 'nums' is an array and all elements are numeric
    if (!Array.isArray(nums) || nums.some(isNaN)) {
        throw new Error('Invalid numeric values in the input array');
    }
    // The compare function (a, b) => a - b is used to sort 'nums' in ascending order.
    // 'a' - 'b', and the result determines the relative order (Negative, 'a' comes before 'b'. Zero, the order remains unchanged. Positive, 'b' comes before 'a'.)
    const sortedNums = nums.sort((a, b) => a - b);
    const midpoint = Math.floor(sortedNums.length / 2);
    // Check if the array has an even or odd number of elements
    if (sortedNums.length % 2 === 0) {
        return Number(((sortedNums[midpoint - 1] + sortedNums[midpoint]) / 2).toFixed(2));
    } else {
        return Number(sortedNums[midpoint]);
    }
}

export function calculateMode(nums) {
    // Validate that 'nums' is an array and all elements are numeric
    if (!Array.isArray(nums) || nums.some(isNaN)) {
        throw new Error('Invalid numeric values in the input array');
    }
    // Create a Map to store the frequency of each number
    const frequencyMap = new Map();
    // Count the frequency of each number in 'nums'
    nums.forEach((num) => {
        // If the number is already in the map, increment its frequency; otherwise, set it to 1
        frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
    });
    let mode;
    let mostFrequent = 0;
    // Find the number with the highest frequency
    frequencyMap.forEach((frequency, num) => {
        // If the current frequency is higher than the most frequent so far, update 'mode' and 'mostFrequent'
        if (frequency > mostFrequent) {
            mode = num;
            mostFrequent = frequency;
        }
    });
    return Number(mode.toFixed(2));
}
