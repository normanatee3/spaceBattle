const onScreen = document.querySelector('.screen') // reference screen area
const buttons = document.querySelector('.buttonArea') // reference button area
let playerSide ; 
let enemySide;  
let center; 
let shields; // init shields
let winner = '' // reference winner of battle
let maxMissiles = 3 // init missiles
let missileCount = maxMissiles
const alienTeam = [] // init enemy team
let highScore = 1
let turn = '1' // init players turn
let credits = 0 // init currency
let level = 1 // game level
let hullUpgrade = 0;
let fireUpgrade = 0;
let missileUpgrade = 0;
let costHull = 50
let costFire = 50
let costMissile = 100
let playerName;
// player object
const player = {
    name: 'Player',
    hull: 20,
    firepower: 5,
    accuracy: .7
}
const playerNameIs = () =>{
    const name = prompt('Please enter your name', 'Player Name')
    if(name!=null){
        playerName = name
    }
}
playerNameIs()
// function to create new enemy ships
const newShip = () =>{
    const alienShip ={
    }
    let levelMod = (Math.floor((Math.random()*(level/3))+1))
    alienShip.name = 'alien' + (alienTeam.length+1)
    alienShip.hull = Math.floor(((Math.random()*4)+3)*levelMod)
    alienShip.firepower = Math.floor(((Math.random()*3)+2)+(levelMod/5))
    alienShip.accuracy = (Math.floor((Math.random()*3)+6))/10
    alienShip.maxHull = alienShip.hull
    alienTeam.push(alienShip)
    return alienShip
}
// attack function
const attack = (attacker, target) =>{
    center = document.querySelector('.center')
    if(Math.random() < attacker.accuracy){
        target.hull -= attacker.firepower
        center.innerHTML+=(`${attacker.name} hit for ${attacker.firepower}<br>`);
    }else{
        center.innerHTML+=(`${attacker.name} missed<br>`);
    }
}
// determine winner of battle
const battle = (fighter1, fighter2) => {
    
    while(fighter1.hull>0 && fighter2.hull>0){
        if(turn == '1'){
            // console.log(`turn 1`);
            attack(fighter1, fighter2)
            turn = '2'
        }else if(turn == '2'){
            // console.log(`turn 2`);
            attack(fighter2, fighter1)
            turn = '1'
        }
    }
    if(fighter1.hull <= 0){
        winner = 'enemy'
    }else if(fighter2.hull <= 0){
        winner = 'player'
    }

}
// start the game
const startButton = () =>{
    let enemyCount = Math.floor(Math.random()*8)+3
    shields = Math.floor((Math.random()*11)+(player.hull/2))
    player.hull = (20+hullUpgrade)
    player.firepower = (5+(fireUpgrade/5))
    player.hull += shields
    missileCount=maxMissiles
    createStart()
    createFireButton('Fire')
    createMissileButton('Missile')
    createFleeButton('Flee')
    createWoopsButton('Woops')
    createPlayer()
    playerStats()
    if(level % 10 === 0){
        bossShip()
        createEnemy()
        enemyStats()
        styleBoss()
    }else{
        for(let i = 0; i<enemyCount; i++){
            newShip()
            createEnemy()
            enemyStats()
        }
    }

}
// layout game-play screen
const createStart = () =>{
    onScreen.innerHTML = ''
    buttons.innerHTML = ''
    let ps = document.createElement("div")
    ps.classList.add('playerSide')
    let ce = document.createElement("div")
    ce.classList.add('center')
    let es = document.createElement("div")
    es.classList.add('enemySide')
    onScreen.append(ps, ce, es)

}
const createFireButton = (btnName) =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.classList.add(btnName)
    button1.addEventListener('click', () =>{
        if(alienTeam.length == 0){
            winState()
            levelUp()
            
        }else{
            center = document.querySelector('.center')
            center.innerHTML=(`You Started with ${player.hull} health.<br>`);
            player.firepower = (5+(fireUpgrade/5))
            turn = '1'
            battleRound(player, alienTeam[alienTeam.length-1])
            if(winner == 'player'){
                gainCredits()
                destroyEnemy()
        }else if(winner == 'enemy'){
            center.innerHTML+=(`You Lost.<br>`);
            buttons.innerHTML = '<button onclick="startButton()" class="btn">Start</button>'
            onScreen.innerHTML = 'You Lost. Click Start to Try again'
            newState()
            resetCredits()
            if(level>highScore){
                let score = document.querySelector('.highScore')
                highScore=level
                score.innerHTML=`High Score: ${highScore}`
            }
            if(level>10){
                level-=10
            }else{

                levelReset()
            }
            
        }
    } 
    })
    button1.innerHTML = btnName
    buttons.append(button1)
}
const createMissileButton = (btnName) =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.classList.add(btnName)
    button1.innerHTML = `${btnName}s - ${missileCount}`
    button1.addEventListener('click', () =>{
        center = document.querySelector('.center')
        if(alienTeam.length == 0){
            winState()
            levelUp()
            
        }else{
            let storeFP = player.firepower
            player.firepower = Math.floor(player.firepower*((Math.random()*2)+2))
            if(missileCount>0){
                center.innerHTML=(`You Started with ${player.hull} health.<br>`);
                center.innerHTML+=(`You fired a missile.<br>`);
                attack(player, alienTeam[0])
                if(alienTeam[0].hull<=0){
                    gainCredits()
                    destroyEnemy()
                    missileCount--
                }else if(alienTeam[0].hull>0){
                    center.innerHTML+=(`Enemy is still alive with ${alienTeam[0].hull} health.<br>`);
                    missileCount--
                }
                button1.innerHTML = `${btnName}s - ${missileCount}`
            }else{
                center.innerHTML=(`You are out of Missiles.<br>`);
            }player.firepower = storeFP
    }
    })
    
    buttons.append(button1)
}
const createFleeButton = (btnName) =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.classList.add(btnName)
    button1.addEventListener('click', () =>{
        buttons.innerHTML = `            <button onclick="startButton()" class="btn">Start</button>
        <button onclick="goShop()" class="btn">Upgrades</button>`
        onScreen.innerHTML = 'You Ran Away and lost half your Credits'
        player.hull = (20+hullUpgrade)
        alienTeam.length = 0
        missileCount = maxMissiles
        fleeCredits()
        
    })
    button1.innerHTML = btnName
    buttons.append(button1)
}
const createWoopsButton = (btnName) =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.classList.add(btnName)
    button1.addEventListener('click', () =>{
        let x = (Math.floor(Math.random()*256))
        let y = (Math.floor(Math.random()*256))
        let z = (Math.floor(Math.random()*256))
        let randomColor = "rgb(" + x + "," + y + "," + z + ")"
        document.body.style.backgroundColor = randomColor
    })
    button1.innerHTML = btnName
    buttons.append(button1)
}
const createPlayer = () =>{
    playerSide = document.querySelector('.playerSide')
    let player = document.createElement("div")
    player.classList.add('player')
    playerSide.append(player)
}
const createEnemy = () =>{
    enemySide = document.querySelector('.enemySide')
    let enemy = document.createElement("div")
    enemy.classList.add('enemy')
    enemySide.prepend(enemy)
    
}
const winState = () =>{
    buttons.innerHTML = `            <button onclick="startButton()" class="btn">Start</button>
    <button onclick="goShop()" class="btn">Upgrades</button>`
    onScreen.innerHTML = 'You Beat The Level. Click Start To Move On'
    player.hull = (20+hullUpgrade)
    alienTeam.length = 0
    missileCount = maxMissiles
}
const destroyEnemy = () =>{
    center.innerHTML+=(`You Won.<br>`);
    alienTeam.pop()
    let enemy = document.querySelector('.enemy')
    enemy.remove()
    center.innerHTML+=(`You have ${player.hull} health remaining.<br>`);
}
const gainCredits = () =>{
    credits += Math.floor(((Math.random()*10)+level)+(alienTeam[0].maxHull/2))
    let creditTotal = document.querySelector('.credits')
    creditTotal.innerHTML = `Credits: ${credits}`
}
const resetCredits = () =>{
    credits = 0
    let creditTotal = document.querySelector('.credits')
    creditTotal.innerHTML = `Credits: 0`
}
const fleeCredits = () =>{
    credits = Math.floor(credits/2)
    let creditTotal = document.querySelector('.credits')
    creditTotal.innerHTML = `Credits: ${credits}`
}
const levelUp = () =>{
    level++
    let levelCount = document.querySelector('.level')
    levelCount.innerHTML = `Level: ${level}`
}
const levelReset = () =>{
    level = 1
    let levelCount = document.querySelector('.level')
    levelCount.innerHTML = `Level: 1`
}
const goShop = () =>{
    onScreen.innerHTML=''
    hullButton()
    replaceScreenText(`Cost:${costHull}`, 'hull')
    firepowerButton()
    replaceScreenText(`Cost:${costFire}`, 'fire')
    missileButton()
    replaceScreenText(`Cost:${costMissile}`, 'missile')
}
const hullButton = () =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.addEventListener('click', () =>{

        if(credits >= costHull){
            hullUpgrade+= 5
            credits-= costHull
            let creditTotal = document.querySelector('.credits')
        creditTotal.innerHTML = `Credits: ${credits}`
        costHull+=hullUpgrade*2
        }else{
            alert(`Ya broke boi`)
        }replaceScreenText(`Cost:${costHull}`, 'hull')
    })
    button1.innerHTML = 'HULL'
    onScreen.appendChild(button1)
    insertScreenText(`Cost:${costHull}`, 'hull')
}
const firepowerButton = () =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.addEventListener('click', () =>{

        if(credits >= costFire){
            fireUpgrade+= 5
            credits-= costFire
            let creditTotal = document.querySelector('.credits')
            creditTotal.innerHTML = `Credits: ${credits}`
            costFire+= fireUpgrade*2
        }else{
            alert(`Ya broke boi`)
        }replaceScreenText(`Cost:${costFire}`, 'fire')
    })
    button1.innerHTML = `FIREPOWER`
    onScreen.appendChild(button1)
    insertScreenText(`Cost:${costFire}`, 'fire')
}
const insertScreenText = (text, id) =>{
    const type = document.createElement('p')
    type.setAttribute('Class', `price ${id}`)
    const content = document.createTextNode(text)
    type.appendChild(content)
    document.querySelector('.screen').appendChild(type)
}
const replaceScreenText = (text, id) =>{
    const type = document.createElement('p')
    type.setAttribute('Class', `price ${id}`)
    const content = document.createTextNode(text)
    type.appendChild(content)
    let oldChild = document.querySelector(`.${id}`)
    document.querySelector('.screen').replaceChild(type, oldChild)
}
const playerStats = () =>{
    document.querySelector('.player').setAttribute('title', `Name: ${playerName} \nHealth: ${player.hull} \nFirepower ${player.firepower} \nAccuracy: ${player.accuracy}`)
}
const enemyStats = () =>{
    for(i=0; i<alienTeam.length; i++){
        let enemy = document.querySelector('.enemy')
        enemy.setAttribute('title', `Name: ${alienTeam[i].name} \nHealth: ${alienTeam[i].hull} \nFirepower ${alienTeam[i].firepower} \nAccuracy: ${alienTeam[i].accuracy}`)
    }
}
const newState = () =>{
    player.hull = 20
    alienTeam.length = 0
    maxMissiles = 3
    missileCount = maxMissiles
    hullUpgrade = 0
    fireUpgrade = 0
    costHull = 50
    costFire = 50
}
const battleRound = (fighter1, fighter2) => {
    
    while(fighter1.hull>0 && fighter2.hull>0){
        if(turn == '1'){
            // console.log(`turn 1`);
            attack(fighter1, fighter2)
            turn = '2'
        }else if(turn == '2'){
            // console.log(`turn 2`);
            attack(fighter2, fighter1)
            break
        }
    }
    if(fighter1.hull <= 0){
        winner = 'enemy'
    }else if(fighter2.hull <= 0){
        winner = 'player'
    }else{
        winner = ''
        center.innerHTML+=(`Enemy is still alive with ${alienTeam[0].hull} health.<br>`);
    }

}
const missileButton = () =>{
    let button1 = document.createElement("button")
    button1.classList.add('btn')
    button1.addEventListener('click', () =>{

        if(credits >= costMissile){
            missileUpgrade+= 1
            maxMissiles++
            credits-= costMissile
            let creditTotal = document.querySelector('.credits')
            creditTotal.innerHTML = `Credits: ${credits}`
            costMissile+= missileUpgrade*70
        }else{
            alert(`Ya broke boi`)
        }replaceScreenText(`Cost:${costMissile}`, 'missile')
    })
    button1.innerHTML = `MISSILE`
    onScreen.appendChild(button1)
    insertScreenText(`Cost:${costMissile}`, 'missile')
}
const bossShip = () =>{
    const alienShip ={

    }
    let levelMod = (Math.floor((Math.random()*(level/5))+1))
    alienShip.name = 'alien boss' + (alienTeam.length+1)
    alienShip.hull = Math.floor((((Math.random()*6)+10)*5)*levelMod)
    alienShip.firepower = Math.floor(((Math.random()*4)+3)+(levelMod/5))
    alienShip.accuracy = (Math.floor((Math.random()*3)+6))/10
    alienShip.maxHull = alienShip.hull
    alienTeam.push(alienShip)
    return alienShip
    
}
const styleBoss = () => {
    let target = document.querySelector('.enemy')
    target.classList.add('boss')
}
// done