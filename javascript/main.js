var player = {
    currentSoul: {
        soulTotal: 0,
        soulDark: 0,
        soulLight: 0,
        
        beadsLight: 0,
        beadsDark: 0,
    },
    stats: {
        //Run-specific things
        runTotalS: 0,
        runTotalsD: 0,
        runTotalsL: 0,
    
        //All-time specific things
        allTotalS: 0,
        allTotalD: 0,
        allTotalL: 0,
    },
    
    unlocks: {
        //tabs
        tailsUnlocked: true,
        storyUnlocked: false,
        crystalsUnlocked: false,
        mansionUnlocked: false,

        //prestige mechanics
        prestigeLightUnlocked: true,
        prestigeDarkUnlocked: true,
    },

    activeStuff: {
        activeMainTab: "soul",
        activeSoulTab: "map",
    },

    loading: true,
    showIntro: true,
}

window.addEventListener('load', function() {

    const format = new Format("scientific");

    var vm = new Vue({
        el: '#vueWrapper',
        data: player,
        computed: { //I THINK IM DOING THIS WRONG. MAYBE A WAY TO FORMAT NUMBERS IN A BETTER WAY THAN A TON OF COMPUTEDS?
            formattedSoul: function() {
                return format.formatNumber(this.currentSoul.soulTotal);
            },
            formattedLightSoul: function() {
                return format.formatNumber(this.currentSoul.soulLight);
            },
            formattedDarkSoul: function() {
                return format.formatNumber(this.currentSoul.soulDark);
            },
            formattedBeadsLight: function() {
                return format.formatNumber(this.currentSoul.beadsLight);
            },
            formattedBeadsDark: function() {
                return format.formatNumber(this.currentSoul.beadsDark);
            }
        },
    });
    player.loading = false;
});


class Format {
    constructor(notation) {
        this.Notation = notation; //Notation
    }

    formatNumber(n) {
        if(n < 1000) {
            if(n == math.floor(n)) {
                return math.format(n, {notation: 'fixed', precision: 0});
            }
            return math.format(n, {notation: 'fixed', precision: 1}).replace("+","");
        }
        else {
            return math.format(n, {notation: 'exponential', precision: 2}).replace("+","");
        }
    }
}

