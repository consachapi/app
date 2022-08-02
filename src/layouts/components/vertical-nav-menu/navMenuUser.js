export default [
    {
        url: "/",
        name: "Inicio",
        slug: "home",
        icon: "HomeIcon",
    }, {
        url: null,
        name: "Control y Remediación",
        slug: "app-medidas-control-remediacion",
        icon: "LayersIcon",
        submenu: [
            {
                url: "/app/medidas/cremediacion/mcontrol",
                name: "Medidas Control",
                slug: "app-medidas-cremediacion-mcontrol",
            }, {
                url: "/app/medidas/cremediacion/mremediacion",
                name: "Med. Remediación",
                slug: "app-medidas-cremediacion-mremediacion",
            }
        ]
    }, 

]
