export default [
    {
        url: "/",
        name: "Inicio",
        slug: "home",
        icon: "HomeIcon",
    }, {
        url: null,
        name: "Medidas de Control",
        slug: "app-medidas-control",
        icon: "FolderPlusIcon",
        submenu: [
            {
                url: "/app/medidas/control/producto",
                name: "Producto",
                slug: "app-medidas-control-producto",
            }, {
                url: "/app/medidas/control/riesgo",
                name: "Riesgos",
                slug: "app-medidas-control-riesgo",
            }, {
                url: "/app/medidas/control/detalle",
                name: "Med. Control",
                slug: "app-medidas-control-detalle",
            }
        ]
    }, 

    {
        url: null,
        name: "Medidas Remediación",
        slug: "app-medidas-remediacion",
        icon: "AirplayIcon",
        submenu: [
            {
                url: "/app/medidas/remediacion/deficiencia",
                name: "Deficiencias SCI",
                slug: "app-medidas-remediacion-deficiencia",
            }, {
                url: "/app/medidas/remediacion/medidas",
                name: "Med. Remediación",
                slug: "app-medidas-remediacion-medidas",
            }
        ]
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
    /*{
        url: null,
        name: "Mantenimiento",
        slug: "app-page-mentenimiento",
        icon: "ServerIcon",
        submenu: [
            {
                url: "/app/mantenimiento/producto",
                name: "Oficina",
                slug: "app-mantenimiento-producto",
            }, {
                url: "/app/mantenimiento/dispositivo",
                name: "Dispositivo",
                slug: "app-mantenimiento-dispositivo",
            }, {
                url: "/app/mantenimiento/servicio",
                name: "Servicio",
                slug: "app-mantenimiento-servicio",
            }
        ]
    }, */
    
    {
        url: null,
        name: "Usuarios y Acceso",
        slug: "app-usuario-acceso",
        icon: "LockIcon",
        submenu: [
            {
                url: "/app/acceso/persona",
                name: "Persona",
                slug: "app-acceso-persona-lista",
            },
        ]
    }, {
        url: "/configuracion",
        name: "Configuración",
        slug: "config-app-page",
        icon: "SettingsIcon",
    }

  ]
