import { DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'

import { filter } from 'lodash'
import { GET_PEOPLE, REMOVE_PERSON } from '../../queries'
import { useEffect, useState } from 'react'


const RemovePerson = ({ id, firstName, lastName }) => {
  const [, forcedUpdate] = useState()

  useEffect(() => {
    forcedUpdate({})
  }, [])
  const [removePerson] = useMutation(REMOVE_PERSON, {
    update(proxy, { data: { removePerson } }) {
      const { people } = proxy.readQuery({ query: GET_PEOPLE })
      proxy.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: filter(people, o => {
            return o.id !== removePerson.id
          })
        }
      })
    }
  })

  const handleButtonClick = () => {
    let result = window.confirm('Are you sure you want to delete this contact?')
    if (result) {
      removePerson({
        variables: {
          id
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removePerson: {
            __typename: 'person',
            id,
            firstName,
            lastName
          }
        }
      })
    }
  }
  return <DeleteOutlined key='delete' onClick={handleButtonClick} style={{ color: 'red' }} />
}

export default RemovePerson