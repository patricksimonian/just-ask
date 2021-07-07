import { useEffect, useMemo, useState } from "react"
import {Box, Text} from 'rebass';
import {useTable} from 'react-table';
import axios from '../axios'
import { WidthControlledContainer } from "../components/Containers"
import WithRole from '../components/WithRole';
import { useQueryParams } from "../utils/hooks"
import { ROLES } from "../constants";
import { Link } from '@reach/router';
export const Audits = () => {
  
  const [audits, setAudits] = useState(null)
  const [fetched, setFetched] = useState(false)
  const { page } = useQueryParams(['page']);
  const validatedPage = isNaN(parseInt(page)) ? 1 : parseInt(page)
  const [fetchedPage, setFetchedPage] = useState(validatedPage);
  const PAGE_LIMIT = 100;

  useEffect(() => {
    if(fetchedPage !== validatedPage) {
      setFetched(false);
    }
  }, [fetchedPage, validatedPage])

  useEffect(() => {
    if(!fetched) {
      axios.get(`/audits?page=${validatedPage}&limit=${PAGE_LIMIT}`).then((res) => {
        setFetchedPage(validatedPage)
        setFetched(true);
        setAudits(res.data)
      })
      .catch(() => {
        setFetchedPage(validatedPage)
        setFetched(true);
      })

    }
  }, [fetched, setFetched, setAudits, validatedPage, PAGE_LIMIT])

  const data = useMemo(() => {
    if(audits !== null) {
      return audits.data.map(a => ({...a.data, payload: JSON.stringify(a.data.payload), createdAt: a.createdAt }))
    }
    return []
  }, [audits])

  const columns = useMemo(() => [
    {
      Header: 'Type',
      accessor: 'type'
    },
    { 
      Header: 'Message',
      accessor: 'message'
    },
    {
      Header: 'Github Id',
      accessor: 'user'
    },
    {
      Header: 'Payload',
      accessor: 'payload'
    },
    {
      Header: 'Date',
      accessor: 'createdAt'
    }
  ], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data})
  console.log(audits.count, validatedPage, PAGE_LIMIT)
  return (
    <WithRole roles={[ROLES.AUDITOR, ROLES.ADMINISTRATOR]}>

      <WidthControlledContainer>
        <Box pb={3}>

        {validatedPage > 1 && <Box  as="span" pr={3}> <Link to={`?page=${validatedPage - 1}`} >Previous Page</Link> </Box>}
        {audits && audits.count > validatedPage * PAGE_LIMIT && <Link to={`?page=${validatedPage + 1}`}>Next Page</Link>}
        </Box>
        <Box  sx={{maxHeight: '75vh',
          overflow: 'auto'}}>
          {!fetched && <Text> Loading...</Text>}
{ audits && fetched && <Box as="table" sx={{
          borderSpacing: 0,
          border: '1px solid',
          borderColor: 'primary',
          borderCollapse: 'collapse',
          
        }} {...getTableProps()}>
          <Box as="thead" sx={{
            borderBottom: '1px solid',
            borderColor: 'primary',
          }}>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Box as="th" sx={{
                    borderBottom: '1px solid',
                    borderRight: '1px solid',
                    borderColor: 'primary',
                  }} p={3} {...column.getHeaderProps()}>{column.render('Header')}</Box>
                  ))}
              </tr>
            ))}
          </Box>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <Box  as="td" p={2} sx={{
                      borderBottom: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'primary',
                    }} {...cell.getCellProps()}>{cell.render('Cell')}</Box>
                  })}
                </tr>
              )
            })}
          </tbody>
        </Box> }
        </Box>
        
      </WidthControlledContainer>
    </WithRole>

  )
}