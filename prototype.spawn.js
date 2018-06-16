module.exports = function() {
    StructureSpawn.prototype.createCustomCreep = function(energy, roleName, home, target) {
        var numberOfParts = Math.floor(energy / 200)
        var body = []

        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK)
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY)
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE)
        }

        return this.createCreep(body, roleName + Game.time, {
            role: roleName,
            home: home,
            target: target
        })
    };

    StructureSpawn.prototype.createLongDistanceHarvester = function(home, target) {
        var body = [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        return this.createCreep(body, 'LongDistanceHarvester' + Game.time, {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
        })
    };
    
    StructureSpawn.prototype.createClaimer = function(target) {
        var body = [CLAIM, MOVE]
        return this.createCreep(body, 'Claimer' + Game.time, {
            role: 'claimer',
            target: target
        })
    };
};