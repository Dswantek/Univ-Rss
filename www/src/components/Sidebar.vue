<template>
    <nav id="sidebar" class="row">
        <div class="sidebar-header">
            <h1 class="univ-rss">UNIV
                <i class="fa fa-rss"></i>
            </h1>
            <div class="col-xs-12">
                <img class="userImage" :src="user.image" at="User Image"></img>
            </div>
            <div class="col-xs-6 col-xs-offset-3">
                <h3>
                    {{user.name}}
                </h3>
            </div>
            <h6>{{user.email}}</h6>
            <button type="button" class="btn btn-danger logout" @click="logout">
                <i class="fa fa-power-off"></i> Logout</button>
        </div>
        <div class="scrollable">
            <ul class="list-unstyled components">
                <li>
                    <router-link to="Home">
                        <i class="fa fa-home fa-lg"></i> Home</router-link>
                </li>
                <li>
                    <a @click="closeSidebar" data-toggle="modal" data-target="#editProfileModal" data-dismiss="#editFeedModal">
                        <i class="fa fa-cog fa-lg"></i> Profile
                    </a>
                </li>
                <li>
                    <a href="#feedSubmenu" data-toggle="collapse" aria-expanded="false">
                        <i class="fa fa-feed fa-lg"></i> Feeds</a>
                    <ul class="collapse list-unstyled" id="feedSubmenu">
                        <li>
                            <a @click="closeSidebar" data-toggle="modal" data-target="#editFeedModal">
                                <i class="fa fa-gear fa-lg"></i> Edit Feeds</a>
                        </li>
                        <li v-for="category in categories">
                            <a :href="'#'+ category._id" data-toggle="collapse" aria-expanded="false">
                                {{category.name}}
                                <i class="fa fa-remove" @click="removeCategory(category._id)"></i>
                            </a>
                            <ul class="collapse list unstyled" :id="category._id">
                                <li v-for="feed in feeds">
                                    <a v-if="category._id == feed.categoryId" class="feed-name">
                                        <input type="checkbox" class="form-check-input" :id="feed._id">
                                        <h6>{{feed.name}}</h6>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href="#componentSubmenu" data-toggle="collapse" aria-expanded="false">
                        <i class="fa fa-briefcase fa-lg"></i> Components</a>
                    <ul class="collapse list-unstyled" id="componentSubmenu">
                        <li>
                            <a @click="setClock">
                                <i class="fa fa-clock-o fa-lg"></i> Clock</a>
                        </li>
                        <li>
                            <a @click="setTodo">
                                <i class="fa fa-list-ol fa-lg"></i> To-Do</a>
                        </li>
                        <li>
                            <a @click="setWeather">
                                <i class="fa fa-snowflake-o fa-lg"></i> Weather</a>
                        </li>
                        <li>
                            <a @click="setQuote">
                                <i class="fa fa-commenting fa-lg"></i> Inspirational Quote</a>
                        </li>
                        <li>
                            <a @click="createEvent">
                                <i class="fa fa-calendar fa-lg"></i> Local Events</a>
                        </li>
                        <li>
                            <a @click="closeSidebar" data-toggle="modal" data-target="#spotifyModal">
                                <i class="fa fa-spotify fa-lg"></i> Spotify
                            </a>
                        </li>
                        <li>
                            <a @click="closeSidebar" data-toggle="modal" data-target="#imageModal">
                                <i class="fa fa-picture-o fa-lg"></i> Image
                            </a>
                        </li>
                        <li>
                            <a @click="getCal">
                                <i class="fa fa-calendar fa-lg"></i> Get Google Calendar
                            </a>
                        </li>
                        
                        <!-- <li>
                            <a @click="createSpotify">
                                <i class="fa fa-spotify fa-lg"></i> Spotify </a>
                        </li> -->
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    import Profile from './Profile'
    import Feed from './Feed'
    import Spotify from './Spotify'
    import Photo from './Photo'
    export default {
        name: 'sidebar',
        data() {
            return {
                search: {
                    name: ''
                },
                category: {
                    name: '',
                    creatorId: '',
                },
                feed: {
                    name: '',
                    url: ''
                }
            }
        },

        components: {
            Feed,
            Spotify,
            Profile,
            Photo
        },
        mounted() {
            this.$store.dispatch('getCategories')
        },
        methods: {
            closeSidebar() {
                $('#stack').toggleClass('open'),
                $('#sidebar').toggleClass('active')
            },
            removeCategory(category) {
                this.$store.dispatch('removeCategory', category)
            },
            logout() {
                this.$store.dispatch('logout')
            },
            setClock() {
                var updateClock = {
                    userId: this.user._id,
                    clock: !this.user.clock
                }
                this.$store.dispatch('updateClock', updateClock)
            },
            setTodo() {
                var updateTodo = {
                    userId: this.user._id,
                    todo: !this.user.todo
                }
                this.$store.dispatch('updateTodo', updateTodo)
            },
            setWeather() {
                var updateWeather = {
                    userId: this.user._id,
                    weather: !this.user.weather
                }
                this.$store.dispatch('updateWeather', updateWeather)
            },
            setQuote() {
                var updateQuote = {
                    userId: this.user._id,
                    quote: !this.user.quote
                }
                this.$store.dispatch('updateQuote', updateQuote)
            },
            getCal() {
                this.$store.dispatch('getCal')
            },
            // setEvent() {
            //     var updateEvent = {
            //         userId: this.user._id,
            //         event: !this.user.event
            //     }
            //     this.$store.dispatch('updateEvent', updateEvent)
            // },
            createEvent() {
                var boards = this.$store.state.boards
                var create = true
                for (let j = 0; j < boards.length; j++) {
                    var board = boards[j];
                    if (board.component == "events") {
                        create = false
                        return
                    }
                }
                if (create) {
                    this.newBoard = {
                        x: 4,
                        y: 0,
                        w: 3,
                        h: 10,
                        i: boards.length,
                        title: "Local Events",
                        component: "events"
                    };
                    this.$store.dispatch('createBoard', this.newBoard)

                }
            },
            // createSpotify() {
            //     var boards = this.$store.state.boards
            //     var create = true
            //     for (let j = 0; j < boards.length; j++) {
            //         var board = boards[j];
            //         if (board.i == "1") {
            //             create = false
            //             return
            //         }
            //     }
            //     if(create){
            //             this.newBoard = {
            //                 x: 7,
            //                 y: 0,
            //                 w: 3,
            //                 h: 10,
            //                 i: "1",
            //                 mediaLink:"https://open.spotify.com/embed/user/spotify/playlist/37i9dQZF1DWT6MhXz0jw61",
            //                 title: "Weekly Playlist" 
            //             };
            //             this.$store.dispatch('createBoard', this.newBoard)

            //         }
            // }
        },
        computed: {
            user() {
                return this.$store.state.user
            },
            feeds() {
                return this.$store.state.feeds
            },
            categories() {
                return this.$store.state.categories
            }
        }
    }
</script>

<style scoped>
    /* input {
        width: 80%;
        text-align: center;
        margin: 0 auto;
    }

    .input {
        display: inline-flex;
    } */

    ul {
        list-style-type: none;
    }

    form {
        display: inline-flex;
    }

    span {
        display: inline-flex;
        color: black;
    }

    a {
        cursor: pointer;
    }

    h1 {
        margin-bottom: 2vh;
    }

    .scrollable {
        overflow-y: auto;
        max-height: 45vh;

    }

    ::-webkit-scrollbar {
        width: 1em;
    }

    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3)
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(129, 127, 127, 0.315);
        border-radius: 20px;
    }

    .feed-name {
        padding-left: 6.5rem !important;
    }

    .fa-cog {
        cursor: pointer;
    }

    .userImage {
        border-radius: 50%;
        height: 12rem;
        width: 12rem;
    }


    #sidebar.active {
        transform: translateX(255px);
        transition: .7s ease-in-out;
        opacity: 1;
    }

    a[aria-expanded="false"]::before,
    a[aria-expanded="true"]::before {
        content: '\e259';
        position: relative;
        right: 20px;
        font-family: 'Glyphicons Halflings';
        font-size: 0.6em;
    }

    a[aria-expanded="true"]::before {
        content: '\e260';
        position: relative;
    }

    @media (max-width: 768px) {
        #sidebar {
            margin-left: -250px;
        }
        #sidebar.active {
            margin-left: 0;
        }
    }

    body {
        font-family: 'Poppins', sans-serif;
        background: #fafafa;
    }

    p {
        font-family: 'Poppins', sans-serif;
        font-size: 1.1em;
        font-weight: 300;
        line-height: 1.7em;
        color: #999;
    }

    .categoryStyle {
        display: inline-flex;
        padding: 0 auto;
    }

    .feedStyle {
        margin: 0 auto;
        display: inline-flex;
    }

    .delete {
        float: none;
        padding: 0 auto;
        margin: auto auto;
        color: white;
    }

    a,
    a:hover,
    a:focus {
        color: inherit;
        text-decoration: none;
        transition: all 0.3s;
    }

    #sidebar {
        /* don't forget to add all the previously mentioned styles here too */
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        min-width: 250px;
        max-width: 250px;
        min-height: 90vh;
        z-index: 1 !important;
        margin-left: -270px;
        /* animation-name: fadeOutLeft; */
        /* animation: 1s 0s 0.5 fadeOut; */
        transform: translateX(0);
        transition: .7s ease-in-out;
        opacity: 0;
        /* transition: all 0.3s; */
    }

    /* .fadeIn {
        animation-name: fadeIn;
        animation: 1s 0s 0.5 fadeIn;
    } */

    .fadeOut {
        animation-name: fadeOut;
        animation: 1s 0s 0.5 fadeOut;
    }

    #sidebar .sidebar-header {
        padding-top: 1px;
        padding-bottom: 1px;
        padding-right: 20px;
        padding-left: 20px;
        /* padding: 1px 20px 20px 20px; */
        /* background: rgba(0, 0, 0, 0.7); */
    }

    #sidebar ul.components {
        padding: 0px 0;
        border-bottom: 0px;
    }

    #sidebar ul p {
        color: #fff;
        padding: 10px;
    }

    #sidebar ul li a {
        padding: 10px;
        font-size: 1.1em;
        display: block;
    }

    #sidebar ul li a:hover {
        color: black;
        background: #fff;
    }

    #sidebar ul li.active>a,
    a[aria-expanded="true"] {
        color: #fff;
        background: rgba(0, 1, 3, 1);
    }

    ul ul a {
        font-size: 0.9em !important;
        padding-left: 30px;
        background: rgba(0, 1, 3, 0.521);
    }
</style>