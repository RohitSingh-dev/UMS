const InstructionPanel = () => {
  return (
      <div className="color-black">
          <div style={{borderBottom: "1px solid black", padding: "15px"}}>
              <strong>Instructions for evaluator</strong>
          </div>
          <div className="px-4 mt-3">
              <ol style={{listStyleType: "decimal", marginLeft: "20px"}}>
                  <li className="mb-2">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                  <li className="mb-2">Integer vitae libero ac risus egestas placerat.</li>
                  <li className="mb-2">Praesent placerat risus quis eros.</li>
                  <li className="mb-2">Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</li>
                  <li>Aliquam tincidunt mauris eu risus. Aliquam tincidunt mauris eu risus. Vestibulum auctor dapibus neque.</li>
              </ol>
          </div>
      </div>
  )
}
export default InstructionPanel