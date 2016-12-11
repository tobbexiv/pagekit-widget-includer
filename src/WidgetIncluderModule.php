<?php
namespace Tobbe\WidgetIncluder;

use Pagekit\Application as App;
use Pagekit\Module\Module;
use Pagekit\Widget\Model\Widget;
use Tobbe\WidgetIncluder\Plugin\WidgetPlugin;

class WidgetIncluderModule extends Module
{

    /**
     *
     * {@inheritdoc}
     *
     */
    public function main(App $app)
    {
        $app->subscribe(new WidgetPlugin());
    }

    public function renderWidget(App $app, $widget_id, $options = [])
    {
        // defaults
        $content = '';
        $widgetExists = true;
        $hasAccess = true;
        $disabled = false;

        // get user context
        $user = $app->user();

        /** @var Widget $widget */
        if (!$widget = Widget::where([
            'id' => $widget_id
        ])->first()) {
            $widgetExists = false;
        }

        if ($widgetExists === true) {
            // widget type
            $type = App::widget($widget->type);

            // check permissions
            if ($widget->hasAccess($user) !== true) {
                $hasAccess = false;
            } else if ($widget->status !== 1) {
                $disabled = true;
            } else if ($type === null) {
                $content = '';
            } else {
                // default configuration
                $hideTitle = false;
                $titleSize = 4;
                $title     = $widget->title;

                // overwrite with options
                foreach ($options as $key => $value) {
                    switch ($key) {
                        case 'hideTitle':
                            $hideTitle = ($value === true);
                            break;

                        case 'titleSize':
                            if($value > 0 && $value < 6) {
                                $titleSize = $value;
                            }
                            break;

                        case 'title':
                            $title = $value;
                            break;
                    };
                }

                // create title tag
                if ($hideTitle == false) {
                    $content .= '<h' . $titleSize . '>' . $title . '</h' . $titleSize . '>';
                }

                /*
                 * Markdown should be already replaced. But line breaks from e.g. menu
                 * break the display as soon as there is a title. So we remove them.
                 */
                $content .= preg_replace('/\n/', '', $type->render($widget));
            }
        }

        return compact('content', 'hasAccess', 'disabled', 'widgetExists');
    }
}
