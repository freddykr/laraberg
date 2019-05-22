import CheckboxInput from './checkbox-input'
import RadioInput from './radio-input'
import SelectInput from './select-input'
import TextInput from './text-input'
import TextareaInput from './textarea-input'

const { editPost, element, plugins } = window.wp
const { Component } = element
const { registerPlugin } = plugins
const { PluginSidebar } = editPost
const el = window.wp.element.createElement

export default function () {
  registerPlugin('laraberg-sidebar', {
    render: () => el(Sidebar)
  })
}

class Sidebar extends Component {
  constructor (props) {
    super(props)

    this.inputs = []
    this.radioCache = []
    this.state = { elements: [] }

    this.mustFlushRadio = this.mustFlushRadio.bind(this)
    this.handleElement = this.handleElement.bind(this)
  }

  componentDidMount () {
    this.getElements()
  }

  /**
   * Get all sidebar elements and add them to the sidebar
   */
  getElements () {
    const elements = Array.from(document.querySelectorAll(`.laraberg-sidebar *`))
    elements.forEach(this.handleElement)
    this.flushRadioCache()
    this.setState({ elements: this.inputs })
  }

  /**
   * Takes and element and creates a sidebar input for it
   * @param {Element} element
   * @param {Int} index
   */
  handleElement (element, index) {
    if (this.mustFlushRadio(element)) this.flushRadioCache()

    switch (element.type) {
      case 'text':
        this.inputs.push(this.addInputText(element, index))
        break
      case 'textarea':
        this.inputs.push(this.addInputTextarea(element, index))
        break
      case 'select-one':
        this.inputs.push(this.addInputSelect(element, index))
        break
      case 'checkbox':
        this.inputs.push(this.addInputCheckbox(element, index))
        break
      case 'radio':
        this.radioCache.push(element)
    }
  }

  /**
   * Checks if the element belongs to any previous radio inputs
   * @param {Element} element
   * @returns {Bool} True if element does not belong to any previous radio input
   */
  mustFlushRadio (element) {
    if (!Array.isArray(this.radioCache) || this.radioCache.length < 1) return false
    return (element.type !== 'radio' || element.name !== this.radioCache[0].name)
  }

  /**
   * Add all previous radio inputs to the sidebar and clear radioCache
   * @param {*} index
   */
  flushRadioCache (index) {
    if (this.radioCache.length > 0) {
      this.inputs.push(this.addInputRadio(this.radioCache, index))
      this.radioCache = []
    }
  }

  addInputCheckbox (element, index) {
    return <CheckboxInput key={index} element={element} />
  }

  addInputRadio (elements, index) {
    return <RadioInput key={index} options={elements} />
  }

  addInputSelect (element, index) {
    return <SelectInput key={index} element={element} />
  }

  addInputText (element, index) {
    return <TextInput key={index} element={element} />
  }

  addInputTextarea (element, index) {
    return <TextareaInput key={index} element={element} />
  }

  render () {
    return (
      <PluginSidebar name="laraberg-sidebar" icon="media-text" title="Laraberg">
        <div className="plugin-sidebar-content laraberg-sidebar-content">
          {this.state.elements}
        </div>
      </PluginSidebar>
    )
  }
}
