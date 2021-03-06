var boyNames = [
    'Jackson', 'Aiden', 'Liam', 'Lucas', 'Noah', 'Mason', 'Jayden', 'Ethan',
    'Jacob', 'Jack', 'Caden', 'Logan', 'Benjamin', 'Michael', 'Caleb', 'Ryan',
    'Alexander', 'Elijah', 'James', 'William', 'Oliver', 'Connor', 'Matthew',
    'Daniel', 'Luke', 'Brayden', 'Jayce', 'Henry', 'Carter', 'Dylan', 'Gabriel',
    'Joshua', 'Nicholas', 'Isaac', 'Owen', 'Nathan', 'Grayson', 'Eli', 'Landon',
    'Andrew', 'Max', 'Samuel', 'Gavin', 'Wyatt', 'Christian', 'Hunter', 'Cameron',
    'Evan', 'Charlie', 'David', 'Sebastian', 'Joseph', 'Dominic', 'Anthony',
    'Colton', 'John', 'Tyler', 'Zachary', 'Thomas', 'Julian', 'Levi', 'Adam',
    'Isaiah', 'Alex', 'Aaron', 'Parker', 'Cooper', 'Miles', 'Chase', 'Muhammad',
    'Christopher', 'Blake', 'Austin', 'Jordan', 'Leo', 'Jonathan', 'Adrian',
    'Colin', 'Hudson', 'Ian', 'Xavier', 'Camden', 'Tristan', 'Carson', 'Jason',
    'Nolan', 'Riley', 'Lincoln', 'Brody', 'Bentley', 'Nathaniel', 'Josiah',
    'Declan', 'Jake', 'Asher', 'Jeremiah', 'Cole', 'Mateo', 'Micah', 'Elliot',
    'Dingis'
];
var girlNames = [
    'Sophia', 'Emma', 'Olivia', 'Isabella', 'Mia', 'Ava', 'Lily',
    'Zoe', 'Emily', 'Chloe', 'Layla', 'Madison', 'Madelyn', 'Abigail', 'Aubrey',
    'Charlotte', 'Amelia', 'Ella', 'Kaylee', 'Avery', 'Aaliyah', 'Hailey', 'Hannah',
    'Addison', 'Riley', 'Harper', 'Aria', 'Arianna', 'Mackenzie', 'Lila', 'Evelyn',
    'Adalyn', 'Grace', 'Brooklyn', 'Ellie', 'Anna', 'Kaitlyn', 'Isabelle', 'Sophie',
    'Scarlett', 'Natalie', 'Leah', 'Sarah', 'Nora', 'Mila', 'Elizabeth', 'Lillian',
    'Kylie', 'Audrey', 'Lucy', 'Maya', 'Annabelle', 'Makayla', 'Gabriella', 'Elena',
    'Victoria', 'Claire', 'Savannah', 'Peyton', 'Maria', 'Alaina', 'Kennedy', 'Stella',
    'Liliana', 'Allison', 'Samantha', 'Keira', 'Alyssa', 'Reagan', 'Molly', 'Alexandra',
    'Violet', 'Charlie', 'Julia', 'Sadie', 'Ruby', 'Eva', 'Alice', 'Eliana', 'Taylor',
    'Callie', 'Penelope', 'Camilla', 'Bailey', 'Kaelyn', 'Alexis', 'Kayla', 'Katherine',
    'Sydney', 'Lauren', 'Jasmine', 'London', 'Bella', 'Adeline', 'Caroline', 'Vivian',
    'Juliana', 'Gianna', 'Skyler', 'Jordyn'
];

function getUniqueName(prefix = '') {
    var c = 0;
    var name;
    var exists;

    do {
        var list = Math.random() > 0.5 ? boyNames : girlNames;
        name = prefix + ' ' + list[Math.floor(Math.random() * list.length)];

        if (c > 3) {
            name += list[Math.floor(Math.random() * list.length)];
        }
        c++;
        if (Game.creeps[name] !== undefined) {
            exists = false;
        }
    }
    while (exists);
    return name;
}

Spawn.prototype.createRole = function createRole(role, parts, prefix) {
    var result = ERR_NAME_EXISTS;
    do {
        result = this.createCreep(parts, getUniqueName(prefix), {
            role: role
        });
    } while (result === ERR_NAME_EXISTS);
    return result;
};
