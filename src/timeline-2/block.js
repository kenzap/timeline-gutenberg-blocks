/**
 * BLOCK: timeline-2
 *
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

import { blockProps, ContainerSave } from '../commonComponents/container/container';
import Edit from './edit';

/**
 * Provides the initial data for new block
 */
export const defaultItem = {
    title: __( 'New event', 'kenzap-timeline' ),
    description: __( 'Duis sed odio sit amet nibh vulputate cursus sit amet mauris morbi accumsa ipsum velit etiro auctor ornare odio.', 'kenzap-timeline' ),
};

export const defaultSubBlocks = JSON.stringify( [
    {
        title: __( 'TIMELINE FIRST', 'kenzap-timeline' ),
        description: __( 'Duis sed odio sit amet nibh vulputate cursus sit amet mauris morbi accumsa ipsum velit etiro auctor ornare odio.', 'kenzap-timeline' ),
        key: new Date().getTime() + 1,
    },
    {
        title: __( 'TIMELINE SECOND', 'kenzap-timeline' ),
        description: __( 'Duis sed odio sit amet nibh vulputate cursus sit amet mauris morbi accumsa ipsum velit etiro auctor ornare odio.', 'kenzap-timeline' ),
        key: new Date().getTime() + 2,
    },
    {
        title: __( 'TIMELINE THIRD', 'kenzap-timeline' ),
        description: __( 'Duis sed odio sit amet nibh vulputate cursus sit amet mauris morbi accumsa ipsum velit etiro auctor ornare odio.', 'kenzap-timeline' ),
        key: new Date().getTime() + 3,
    },
    {
        title: __( 'TIMELINE FORTH', 'kenzap-timeline' ),
        description: __( 'Duis sed odio sit amet nibh vulputate cursus sit amet mauris morbi accumsa ipsum velit etiro auctor ornare odio.', 'kenzap-timeline' ),
        key: new Date().getTime() + 4,
    },
] );

/**
 * Generate inline styles for custom settings of the block
 * @param {Object} attributes - of the block
 * @returns {Node} generated styles
 */
export const getStyles = attributes => {
    const kenzapContanerStyles = {
        maxWidth: `${ attributes.containerMaxWidth === '100%' ? '100%' : attributes.containerMaxWidth + 'px' }`,
        '--maxWidth': `${ attributes.containerMaxWidth === '100%' ? '100wh' : attributes.containerMaxWidth + ' ' } `,
    };

    const vars = {
        '--paddings': `${ attributes.containerPadding }`,
        '--paddingsMin': `${ attributes.containerPadding / 4 }`,
        '--paddingsMinPx': `${ attributes.containerPadding / 4 }px`,
        '--verticalLineAndDotsColor': attributes.verticalLineAndDotsColor,
    };

    return {
        vars,
        kenzapContanerStyles,
    };
};

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kenzap/timeline-2', {
    title: __( 'Kenzap timeline 2', 'kenzap-timeline' ),
    icon: 'calendar-alt',
    category: 'layout',
    keywords: [
        __( 'timeline', 'kenzap-timeline' ),
    ],
    anchor: true,
    html: true,
    attributes: {
        ...blockProps,

        backgroundColor: {
            type: 'string',
            default: '#151515',
        },

        titleSize: {
            type: 'number',
            default: 16,
        },

        descriptionSize: {
            type: 'number',
            default: 14,
        },

        textColor: {
            type: 'string',
            default: '#fff',
        },

        verticalLineAndDotsColor: {
            type: 'string',
            default: '#fff',
        },

        items: {
            type: 'array',
            default: [],
        },

        isFirstLoad: {
            type: 'boolean',
            default: true,
        },

        blockUniqId: {
            type: 'number',
            default: 0,
        },
    },

    edit: ( props ) => {
        if ( props.attributes.items.length === 0 && props.attributes.isFirstLoad ) {
            props.setAttributes( {
                items: [ ...JSON.parse( defaultSubBlocks ) ],
                isFirstLoad: false,
            } );
            // TODO It is very bad solution to avoid low speed working of setAttributes function
            props.attributes.items = JSON.parse( defaultSubBlocks );
            if ( ! props.attributes.blockUniqId ) {
                props.setAttributes( {
                    blockUniqId: new Date().getTime(),
                } );
            }
        }

        return ( <Edit { ...props } /> );
    },

    /**
     * The save function defines the way in which the different attributes should be combined
     * into the final markup, which is then serialized by Gutenberg into post_content.
     *
     * The "save" property must be specified and must be a valid function.
     * @param {Object} props - attributes
     * @returns {Node} rendered component
     */
    save: function( props ) {
        const {
            className,
            attributes,
        } = props;

        const { vars, kenzapContanerStyles } = getStyles( props.attributes );

        return (
            <div className={ className ? className : '' } style={ vars }>
                <ContainerSave
                    className={ `kenzap-timeline-2-dark block-${ attributes.blockUniqId }` }
                    attributes={ attributes }
                    style={ vars }
                    withBackground
                    withPadding
                >
                    <div className="kenzap-container" style={ kenzapContanerStyles }>
                        <div className="timeline">
                            { attributes.items && attributes.items.map( ( item ) => (
                                <div
                                    key={ item.key }
                                    className="timeline-content"
                                >
                                    <div className="kenzap-row">
                                        <div className="kenzap-col-6">
                                            <div className="info">

                                                <RichText.Content
                                                    tagName="h3"
                                                    value={ item.title }
                                                    style={ {
                                                            color: attributes.textColor,
                                                            fontSize: `${ attributes.titleSize }px`,
                                                            lineHeight: '1',
                                                        } }
                                                    />
                                                <RichText.Content
                                                    tagName="p"
                                                    value={ item.description }
                                                    style={ {
                                                            color: attributes.textColor,
                                                            fontSize: `${ attributes.descriptionSize }px`,
                                                            lineHeight: '1.72',
                                                        } }
                                                    />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) ) }
                        </div>
                    </div>
                </ContainerSave>
            </div>
        );
    },
} );
