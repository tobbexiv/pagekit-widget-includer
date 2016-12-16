<?php

return [
    
    'name' => 'tobbe/widget-includer',
    
    'type' => 'extension',
    
    'main' => 'Tobbe\\WidgetIncluder\\WidgetIncluderModule',
    
    'autoload' => [
        'Tobbe\\WidgetIncluder\\' => 'src'
    ],

    'permissions' => [
        'widgetincluder: use editor plugin' => [
            'title' => _('Use the widget includer editor plugin')
        ]
    ],

    'routes' => [

        '/api/widgetincluder' => [
            'name' => '@widgetincluder/api',
            'controller' => [
                'Tobbe\\WidgetIncluder\\Controller\\WidgetApiController'
            ]
        ]

    ],

    'resources' => [
        'tobbe/widget-includer:' => ''
    ],
    
    'events' => [
        'view.scripts' => function ($event, $scripts) use ($app) {

            $packageVersion = $app->config('system')->get('packages.tobbe/widget-includer');
            $packageVersionHash = substr(sha1($app->system()->config('secret') . $packageVersion), 0, 4);

            if ($app['user']->hasAccess('widgetincluder: use editor plugin')) {
                $scripts->register('editor-widget', 'tobbe/widget-includer:app/bundle/editor-widget.js', ['~editor'], ['version' => $packageVersionHash]);
            }
            
        }
    ]
    
];

?>