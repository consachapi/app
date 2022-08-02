import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('./views/pages/home/Home.vue')
                },
                /************************************************************************************/ 
                {
                    path: '/app/medidas/control/producto',
                    name: 'app-medidas-control-producto',
                    component: () => import('./views/pages/control/Producto.vue'),
                    meta: {
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Productos Priorizados', active: true }
                        ],
                        pageTitle: 'Medidas de Control',
                        no_scroll: true,
                        parent: 'app-medidas-control-producto'
                    }, 
                },
                {
                    path: '/app/medidas/control/riesgo',
                    name: 'app-medidas-control-riesgo',
                    component: () => import('./views/pages/control/Riesgo.vue'),
                    meta: {
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Riesgos', active: true }
                        ],
                        pageTitle: 'Medidas de Control',
                        no_scroll: true,
                        parent: 'app-medidas-control-riesgo'
                    }, 
                }, 
                {
                    path: '/app/medidas/control/detalle',
                    name: 'app-medidas-control-detalle',
                    component: () => import('./views/pages/control/MainMedida.vue'),
                    children: [
                        {
                            path: '',
                            name: 'app-medidas-control-detalle',
                            component: () => import('./views/pages/control/MedidasControl.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas', active: true }
                                ],
                                pageTitle: 'Medidas de Control',
                                no_scroll: true,
                                parent: 'app-medidas-control-detalle'
                            },
                        }, {
                            path: '/app/medidas/control/detalle/verificacion/:id',
                            name: 'app-medidas-control-detalle-verificacion',
                            component: () => import('./views/pages/control/MediosVerificacion.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas', url: '/app/medidas/control/detalle' },
                                    { title: 'Medios de Verificación', active: true }
                                ],
                                pageTitle: 'Medidas de Control',
                                no_scroll: true,
                                parent: 'app-medidas-control-detalle'
                            },
                        }
                    ],
                }, 
                /************************************************************************************/ 
                {
                    path: '/app/medidas/remediacion/deficiencia',
                    name: 'app-medidas-remediacion-deficiencia',
                    component: () => import('./views/pages/remediacion/Deficiencia.vue'),
                    meta: {
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Deficiencias del SCI', active: true }
                        ],
                        pageTitle: 'Medidas de Remediación',
                        no_scroll: true,
                        parent: 'app-medidas-remediacion-deficiencia'
                    }, 
                },
                {
                    path: '/app/medidas/remediacion/medidas',
                    name: 'app-medidas-remediacion-medidas',
                    component: () => import('./views/pages/remediacion/MainMedidaRemediacion.vue'),
                    children: [
                        {
                            path: '',
                            name: 'app-medidas-remediacion-medidas',
                            component: () => import('./views/pages/remediacion/MedidasRemediacion.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Remediación', active: true }
                                ],
                                pageTitle: 'Medidas de Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-remediacion-medidas'
                            },
                        }, {
                            path: '/app/medidas/remediacion/detalle/verificacion/:id',
                            name: 'app-medidas-remediacion-medidas-verificacion',
                            component: () => import('./views/pages/remediacion/MediosRemediacionVerificacion.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Remediación', url: '/app/medidas/remediacion/medidas' },
                                    { title: 'Medios de Verificación', active: true }
                                ],
                                pageTitle: 'Medidas de Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-remediacion-medidas'
                            },
                        }
                    ],
                },


                
                /************************************************************************************/
                {
                    path: '/app/medidas/cremediacion/mcontrol',
                    name: 'app-medidas-cremediacion-mcontrol',
                    component: () => import('./views/pages/actividad/MainActividadControl.vue'),
                    children: [
                        {
                            path: '',
                            name: 'app-medidas-cremediacion-mcontrol',
                            component: () => import('./views/pages/actividad/Control.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas de Control', active: true }
                                ],
                                pageTitle: 'Control y Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-cremediacion-mcontrol'
                            }
                        }, {
                            path: '/app/medidas/cremediacion/mcontrol/actividad/:id',
                            name: 'app-medidas-cremediacion-mcontrol-actividad',
                            component: () => import('./views/pages/actividad/ActividadControl.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas de Control', url: '/app/medidas/cremediacion/mcontrol' },
                                    { title: 'Actividades de Verificación', active: true }
                                ],
                                pageTitle: 'Control y Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-cremediacion-mcontrol'
                            },
                        }
                    ],
                }, {
                    path: '/app/medidas/cremediacion/mremediacion',
                    name: 'app-medidas-cremediacion-mremediacion',
                    component: () => import('./views/pages/actividad/MainActividadRemediacion.vue'),
                    children: [
                        {
                            path: '',
                            name: 'app-medidas-cremediacion-mremediacion',
                            component: () => import('./views/pages/actividad/Remediacion.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas de Remediación', active: true }
                                ],
                                pageTitle: 'Control y Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-cremediacion-mremediacion'
                            }
                        }, {
                            path: '/app/medidas/cremediacion/mremediacion/actividad/:id',
                            name: 'app-medidas-cremediacion-mremediacion-actividad',
                            component: () => import('./views/pages/actividad/ActividadRemediacion.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Home', url: '/' },
                                    { title: 'Medidas de Remediación', url: '/app/medidas/cremediacion/mremediacion' },
                                    { title: 'Actividades de Verificación', active: true }
                                ],
                                pageTitle: 'Control y Remediación',
                                no_scroll: true,
                                parent: 'app-medidas-cremediacion-mremediacion'
                            },
                        }
                    ]
                },
                /************************************************************************************/        
                {
                    path: '/app/mantenimiento/producto',
                    name: 'app-mantenimiento-producto',
                    component: () => import('./views/pages/mantenimiento/Producto.vue'),
                    meta: {
                        breadcrumb: [
                            { title: 'Home', url: '/' },
                            { title: 'Productos', active: true }
                        ],
                        pageTitle: 'Mantenimiento'
                    },
                },
                /************************************************************************************/
                {
                    path: '/app/acceso/persona',
                    name: 'app-acceso-persona-lista',
                    component: () => import('./views/pages/acceso/MainPersona.vue'),
                    children: [
                        {
                            path: '',
                            name: 'app-acceso-persona-lista',
                            component: () => import('./views/pages/acceso/Persona.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Persona', active: true }
                                ],
                                pageTitle: 'Usuarios y Acceso',
                                no_scroll: true,
                                parent: 'app-acceso-persona-lista'
                            }
                        }, {
                            path: '/app/acceso/persona/detalle/:id',
                            name: 'app-acceso-persona-detalle',
                            component: () => import('./views/pages/acceso/DetallePersona.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Usuarios y Acceso', url: '/app/acceso/persona' },
                                    { title: 'Persona'},
                                    { title: 'Detalle', active: true }
                                ],
                                pageTitle: 'Usuarios y Acceso',
                                parent: 'app-acceso-persona-lista'
                            },
                        }
                    ]
                },
                /************************************************************************************/
                {
                    path: '/configuracion',
                    name: 'config-app-page',
                    component: () => import('./views/pages/config/Configuracion.vue')
                },
            ],
        }, {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            meta: {
                requiresVisitor: true
            },
            children: [
                {
                    path: '/login',
                    name: 'login-page',
                    component: () => import('@/views/pages/Login.vue')
                },
            ]
        }, {
            path: '*',
            redirect: '/'
        }
    ],
})

router.afterEach(() => {
    const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
