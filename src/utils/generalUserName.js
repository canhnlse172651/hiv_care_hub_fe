export  const generateRandomUsername = ()  =>{
    const adjectives = ["Cool", "Smart", "Brave", "Quick", "Clever"];
    const nouns = ["Tiger", "Eagle", "Shark", "Panther", "Wolf"];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 10000); // Số ngẫu nhiên từ 0 đến 9999

    const username = `${randomAdjective}${randomNoun}${randomNumber}`;
    return username;
}


