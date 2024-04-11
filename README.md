# Overtime tracker

This is used for emergency personnel to track overtime.
Sometimes people call in sick and that creates a gap (timeslot). These gaps are listed under each role and people can 
apply for the overtime. 

There are two roles: Call taker (they are the ones that answer the phone), and Dispatcher (they coordinate emergency
vehicles and personnel). Provision has been made for adding more.
There are three areas: North (NECC), Central (CECC), South (SECC).

In the admin tab, there are sections to administer the overtime requests. In order to become an admin for testing,
just change user.role to 0 in the database.


## SQL
                                                     ╔═════════════════╗
                                                     ║ area            ║
                             ╔═══════════════════╗   ╟─────────────────╢
                             ║ timeslot          ║ ┌►╢id(PK)        int║
                             ╟───────────────────╢ │ ║area_name varchar║
                           ┌►╢id(PK)          int║ │ ║active     int(1)║
                           │ ║area(FK)        int╟─┘ ╚═════════════════╝
╔════════════════════════╗ │ ║role(FK)        int╟─┐ ╔═════════════════╗   ╔════════════════════════╗
║ request                ║ │ ║taken(FK)       int╟┐│ ║ role            ║   ║ notify                 ║
╟────────────────────────╢ │ ║start_time datetime║││ ╟─────────────────╢   ╟────────────────────────╢
║id(PK)               int║ │ ║end_time   datetime║│└►╢id(PK)        int╟◄┐ ║id(PK)               int║
║timeslot(FK)         int╟─┘ ╚═══════════════════╝│  ║role_name varchar║ └─╢role(FK)             int║
║user(FK)             int╟────────────────────────┤  ║active     int(1)║ ┌─╢user(FK)             int║
║approved_by(FK)      int╟────────────────────────┤  ╚═════════════════╝ │ ║timeslot            date║
╚════════════════════════╝                        │  ╔═════════════════╗ │ ║requested_time timestamp║
                                                  │  ║ user            ║ │ ╚════════════════════════╝
                                                  │  ╟─────────────────╢ │
                                                  └─►╢id(PK)        int╟◄┘
                                                     ║role(FK)      int║
                                                     ║email     varchar║
                                                     ║password  varchar║
                                                     ║fullname  varchar║
                                                     ║phone     varchar║
                                                     ║format    varchar║
                                                     ║active     int(1)║
                                                     ╚═════════════════╝
