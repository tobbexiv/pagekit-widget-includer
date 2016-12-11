<?php

namespace Tobbe\WidgetIncluder\Controller;

use Pagekit\Application as App;
use Pagekit\Widget\Model\Widget;

/**
 * @Route("widget", name="widget")
 * @Access("widgetincluder: use editor plugin")
 */
class WidgetApiController
{

    /**
     * @Route("/", methods="GET")
     */
    public function indexAction ()
    {
        $widgets = [];

        foreach (Widget::findAll() as $widget) {
            $widgets[] = [
                'id' => $widget->id,
                'title' => $widget->title,
                'disabled' => !$widget->status
            ];
        }

        return $widgets;
    }

    /**
     * @Route("/show", methods="GET")
     * @Request({"options": "array"})
     */
    public function showAction (array $options = [])
    {
        $widget = App::module('tobbe/widget-includer');
        $app = App::getInstance();
        $widget_id = $options['id'];
        unset($options['id']);

        return $widget->renderWidget($app, $widget_id, $options);
    }

}

?>