# versee

## Stack

- convex
- clerk
- vite
- react
- mantine


### Project lifecycle

__Flow__

Text in curly brackets `{}` shows data extracted and stored as project level variables, OR, project level logical operations.

Square brackets `[]` indicate user input required.

1. Upload documents which contain base information and outline terms of agreement.  
eg: Multiple agreements, conditions, terms  
```
{SRC_DOCS}
```

2. Upload documents (or connect events) which contain records relevant to agreement.  
eg: Logs, Communications, Statements, Bills, Invoices, CSVs  
```
{RECORDS}
```

3. Take docs from step 1 and extract follwing information:  
```
{SRC_DOCS}
  - {PROJECT_TERMS}
  - {ROLES}
```

4. Allow user to review and modify it  
```
[review project terms]
[assign roles]
```

5. Take files from step 2 and extract following information:  
```
{RECORDS}
  - {PARTIES}
```

6. Allow user to review and modify it  

```
[party extraction]
[party to role assignment]
```

7. Start complicance check routine:
```
<compliance check routine>
```

