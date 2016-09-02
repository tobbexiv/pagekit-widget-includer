<?php

namespace Tobbe\WidgetIncluder\Controller;

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

}

?>