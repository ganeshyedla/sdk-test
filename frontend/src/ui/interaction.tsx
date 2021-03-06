import React, { useState, useEffect } from 'react'
import { JolocomWebServiceClient } from '@jolocom/web-service-client'
import { InteractionButton } from './interactionButton'
import { SelectionComponent } from './selectionComponent'
import { InteractionType, RpcRoutes } from '../config'

interface Props {
  interactionType: InteractionType
}

export const PeerResolutionContainer = ({
  serviceAPI,
}: {
  serviceAPI: JolocomWebServiceClient
}) => {
  //const [description, setDescription] = useState<string>('Unlock your scooter')
  const startAuth = async () => {
    const resp: { qr: string; err: string } = await serviceAPI.sendRPC(
      RpcRoutes.peerResolutionInterxn,
    )
    console.log(resp)
    return resp
  }

  return (
    <InteractionContainer
      startText="Start Peer Resolution Interaction"
      startHandler={startAuth}
    >
      <h2>Peer Resolution Interaction</h2>
      <div style={{ paddingTop: '20px' }}>
        {/*<h4>Description</h4>
        <input
          style={{
            margin: '10px',
            width: '100%',
          }}
          type="text"
          name="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />*/}
      </div>
    </InteractionContainer>
  )
}

export const CredOfferContainer = ({
  serviceAPI,
  credTypes,
}: {
  serviceAPI: JolocomWebServiceClient
  credTypes: string[]
}) => {
  const [issuedCredentials, setIssued] = useState<Array<string>>([])
  const [invalidCredentials, setInvalid] = useState<Array<string>>([])
  const availableIssueCredentials = credTypes

  const handleSelect = (array: string[], item: string) => {
    return !array.includes(item)
      ? [...array, item]
      : array.filter(val => val !== item)
  }

  useEffect(() => {
    if (issuedCredentials.length === 0 && credTypes && credTypes.length > 0) {
      setIssued(credTypes.slice(0, 1))
    }
  })

  const startCredOffer = async () => {
    const resp: { qr: string; err: string } = await serviceAPI.sendRPC(
      RpcRoutes.offerCred,
      {
        types: Array.from(new Set(issuedCredentials)),
        invalid: Array.from(new Set(invalidCredentials)),
      },
    )
    console.log(resp)
    return resp
  }

  return (
    <InteractionContainer
      startText="Start Credential Offer"
      startHandler={startCredOffer}
    >
      <h2>Credential Offer</h2>
      <SelectionComponent
        title={'Available Credentials'}
        options={availableIssueCredentials}
        onSelect={type => setIssued(handleSelect(issuedCredentials, type))}
        selectedItems={issuedCredentials}
      />
      <SelectionComponent
        title={'Break Credentials'}
        options={issuedCredentials}
        onSelect={type => setInvalid(handleSelect(invalidCredentials, type))}
        selectedItems={invalidCredentials}
      />
    </InteractionContainer>
  )
}

export const InteractionContainer = ({
  startHandler,
  startText,
  children,
}: {
  startHandler: () => Promise<{ qr?: string; jwt?: string; err?: string }>
  startText: string
  children: React.ReactNode
}) => {
  const [qr, setQr] = useState<string | undefined>()
  const [jwt, setJwt] = useState<string>()
  const [err, setErr] = useState<string | undefined>()

  const startBtnHandler = async () => {
    const resp = await startHandler()
    setQr(resp.qr)
    setJwt(resp.jwt)
    setErr(resp.err)
  }

  return (
    <div
      style={{
        background: '#ffefdf',
        marginTop: '70px',
        marginBottom: '70px',
        marginLeft: '10px',
        marginRight: '10px',
        padding: '30px',
        boxShadow: '0px 0px 80px 2px gray',
        borderRadius: '40px',
      }}
    >
      {children}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <InteractionButton onClick={startBtnHandler} text={startText} />

        {err ? (
          <b>Error</b>
        ) : (
          jwt && (
            <div>
              <div
                style={{
                  wordWrap: 'break-word',
                  maxWidth: '50vw',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                }}
              >
                {jwt}
              </div>
            </div>
          )
        )}

        {!err && qr && <img src={qr} className="c-qrcode" alt="QR Code" />}
      </div>
    </div>
  )
}

export const CredShareContainer = ({
  serviceAPI,
  credTypes,
}: {
  serviceAPI: JolocomWebServiceClient
  credTypes: string[]
}) => {
  const [requestedCredentials, setRequested] = useState<Array<string>>([])
  const requestableCredTypes = credTypes

  const handleSelect = (array: string[], item: string) => {
    return !array.includes(item)
      ? [...array, item]
      : array.filter(val => val !== item)
  }

  useEffect(() => {
    if (
      requestedCredentials.length === 0 &&
      credTypes &&
      credTypes.length > 0
    ) {
      setRequested(credTypes.slice(0, 1))
    }
  })

  const startCredRequest = async () => {
    const resp: { qr: string; err: string } = await serviceAPI.sendRPC(
      RpcRoutes.credShareRequest,
      {
        types: Array.from(new Set(requestedCredentials)),
      },
    )
    console.log(resp)
    return resp
  }

  return (
    <InteractionContainer
      startText="Start Credential Request Interaction"
      startHandler={startCredRequest}
    >
      <h2>Credential Request</h2>
      <SelectionComponent
        title={'Available Credentials'}
        options={requestableCredTypes}
        onSelect={type =>
          setRequested(handleSelect(requestedCredentials, type))
        }
        selectedItems={requestedCredentials}
      />
      <div style={{ paddingTop: '20px' }}></div>
    </InteractionContainer>
  )
}
