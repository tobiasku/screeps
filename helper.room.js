require('prototype.spawn')()
var roleHarvester = require('role.harvester')
var roleUpgrader = require('role.upgrader')
var roleBuilder = require('role.builder')
var roleRepairer = require('role.repairer')
var roleTransporter = require('role.transporter')
var roleClaimer = require('role.claimer')
var roleDefender = require('role.defender')

var HOME = 'W29N27'

module.exports = {
    respawnCreeps: function(spawn) {
        for (var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name]
            }
        }

        var energy = spawn.room.energyCapacityAvailable
        var harvestersOne = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.target == HOME)
        var upgradersOne = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.target == HOME)
        var buildersOne = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.target == HOME)
        var repairersOne = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.target == HOME)
        var harvestersTwo = _.filter(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == 'W28N27')

        var name = undefined
        if (harvestersOne.length < 2) {
            name = spawn.createCustomCreep(energy, 'harvester', HOME, HOME)
            if (harvestersOne.length == 0) {
                name = spawn.createCustomCreep(spawn.room.energyAvailable, 'harvester', HOME, HOME)
            }
        }
        else if (upgradersOne.length < 1) {
            name = spawn.createCustomCreep(energy, 'upgrader', HOME, HOME)
        }
        else if (repairersOne.length < 1) {
            name = spawn.createCustomCreep(energy, 'repairer', HOME, HOME)
        }
        else if (buildersOne.length < 1) {
            name = spawn.createCustomCreep(energy, 'builder', HOME, HOME)
        }
        else if (harvestersTwo.length < 2) {
            name = spawn.createLongDistanceHarvester(HOME, 'W28N27')
        }
        else if (buildersOne.length < 3) {
            name = spawn.createCustomCreep(energy, 'builder', HOME, HOME)
        }

        var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer')
        if (Game.spawns['Spawn1'].memory.claimRoom != undefined &&
            Game.spawns['Spawn1'].memory.claimRoom != ''  &&
            claimer.length < 1) {
                name = Game.spawns['Spawn1'].createClaimer(Game.spawns['Spawn1'].memory.claimRoom)
                if (!(name < 0)) {
                    Game.spawns['Spawn1'].memory.claimRoom = ''
            }
        }
    },

    work: function() {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name]
            if (creep.memory.role == 'harvester' || creep.memory.role == 'longDistanceHarvester') {
                roleHarvester.run(creep)
            }
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep)
            }
            else if (creep.memory.role == 'builder') {
                roleBuilder.run(creep)
            }
            else if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep)
            }
            else if (creep.memory.role == 'transporter') {
                roleTransporter.run(creep)
            }
            else if (creep.memory.role == 'claimer') {
                roleClaimer.run(creep)
            }
            else if (creep.memory.role == 'defender') {
                roleDefender.run(creep)
            }
        }
    },

    transferEnergy: function() {
        let sourceLink = Game.getObjectById('5b1a5721b5c85c3870172cf2')
        let destinationLink = Game.getObjectById('5b17973275310174a5ce848e')

        if (sourceLink && destinationLink) {
            if (sourceLink.energy > 0 && (destinationLink.energyCapacity - destinationLink.energy) > 0) {
                sourceLink.transferEnergy(destinationLink)
            }
        }
    },

    /** @param {String} roomName **/
    defendRoom: function(roomName) {
        var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        
        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify('Benutzer ' + username + 'spotted in room ' + roomName + '!');
            towers.forEach(tower => tower.attack(hostiles[0]));
            console.log("ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK! ALERT! ATTACK!");
        }
        else {
            for (let name in Game.creeps) {
                var creep = Game.creeps[name];
                if (creep.hits < creep.hitsMax) {
                    towers.forEach(tower => tower.heal(creep));
                }
            }
            
            for (var i in towers) {
                if (towers.energy > ((towers.energyCapacity / 10) * 9)) {
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART});
                    if (closestDamagedStructure) {
                        towers.repair(closestDamagedStructure);
                    }
                }
            }
        }
    }
};