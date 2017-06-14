module.exports = function tBag(dispatch) {
	
	const STEP_TIME = 1 // how fast to tBag in ms
	let emoteNumberA  = 38, // sit
	    emoteNumberB  = 39, // stand
	    enable = false,
	    interval = null
  
	function sit() {
		dispatch.toServer('C_SOCIAL', 1, { emote: emoteNumberA, unk: 0 })
	}
	function stand() {
		dispatch.toServer('C_SOCIAL', 1, { emote: emoteNumberB, unk: 0 })
	}
  
  
	var intervalFunctions = [ sit, stand ]
	var intervalIndex = 0
  
	function tBag() {
		interval = setInterval(function() {
			intervalFunctions[intervalIndex++ % intervalFunctions.length]();
		}, STEP_TIME)
	}
  
	//Stopping the tBag w/o command
  
	dispatch.hook('C_PLAYER_LOCATION', 1, () => { enable = false, clearInterval(interval) })
	dispatch.hook('C_PRESS_SKILL', 1, () => { enable = false, clearInterval(interval) })
	dispatch.hook('C_SOCIAL', 1, () => { enable = false, clearInterval(interval) })
	dispatch.hook('C_START_SKILL', 1, () => { enable = false, clearInterval(interval) })
	dispatch.hook('S_LOAD_TOPO', 1, () => { enable = false, clearInterval(interval) })
	dispatch.hook('S_RETURN_TO_LOBBY', 1, () => { enable = false, clearInterval(interval) })
  
	// ################# //
	// ### Chat Hook ### //
	// ################# //
  
	dispatch.hook('C_CHAT', 1, (event) => {
		if (/^<FONT>t<\/FONT>$/i.test(event.message)) {
			if(!enable) {
				enable = true
				tBag();
			}
			else {
				enable = false
				clearInterval(interval)
			}
			return false
		}
	})
}
